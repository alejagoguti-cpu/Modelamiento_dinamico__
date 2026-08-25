import pygame
import sys
import math
from dataclasses import dataclass
from typing import List, Tuple
import random

pygame.init()

WIDTH, HEIGHT = 1200, 800
FPS = 60
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (100, 149, 237)
GREEN = (34, 139, 34)
YELLOW = (255, 215, 0)
ORANGE = (255, 165, 0)
RED = (220, 20, 60)
LIGHT_BLUE = (173, 216, 230)
DARK_GREEN = (0, 100, 0)

@dataclass
class State:
    bees: int = 50
    flowers: int = 100
    birds: int = 0
    invasive_species: int = 0
    water_quality: float = 100.0
    air_quality: float = 100.0
    chlorophyll: float = 100.0
    soil_microorganisms: float = 100.0
    soil_nutrients: float = 100.0
    habitat_occupation: float = 0.0
    wetland_capacity: float = 100.0
    food: int = 500
    time: int = 0
    day: int = 1
    month: int = 1
    year: int = 1
    season: int = 0
    paused: bool = False
    message: str = ""
    message_time: int = 0

class Bee:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
        self.vx = random.uniform(-2, 2)
        self.vy = random.uniform(-2, 2)
        self.energy = 100
        self.age = 0

    def update(self, state: State, flowers: List['Flower']):
        self.age += 1
        energy_loss = 0.5 + (100 - state.air_quality) * 0.003
        self.energy -= energy_loss

        nearest_flower = None
        min_dist = float('inf')

        for flower in flowers:
            dist = math.sqrt((self.x - flower.x)**2 + (self.y - flower.y)**2)
            if dist < min_dist:
                min_dist = dist
                nearest_flower = flower

        if nearest_flower and min_dist < 30:
            energy_gain = 5 * (state.air_quality / 100)
            self.energy = min(100, self.energy + energy_gain)
            nearest_flower.pollinated = True
        else:
            self.x += self.vx
            self.y += self.vy

            if self.x < 50 or self.x > WIDTH - 50:
                self.vx *= -1
            if self.y < 50 or self.y > HEIGHT - 150:
                self.vy *= -1

            self.x = max(50, min(WIDTH - 50, self.x))
            self.y = max(50, min(HEIGHT - 150, self.y))

    def draw(self, screen):
        color = YELLOW if self.energy > 50 else ORANGE
        pygame.draw.circle(screen, color, (int(self.x), int(self.y)), 4)
        pygame.draw.circle(screen, BLACK, (int(self.x), int(self.y)), 4, 1)

class Flower:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
        self.pollinated = False
        self.age = 0
        self.alive = True

    def update(self, water_quality: float):
        self.age += 1
        if self.age > 300:
            if random.random() < water_quality / 150:
                self.alive = False
            elif self.pollinated and random.random() < 0.7:
                self.alive = False
                return True
        return False

    def draw(self, screen):
        if self.alive:
            color = GREEN if not self.pollinated else DARK_GREEN
            pygame.draw.circle(screen, color, (int(self.x), int(self.y)), 3)

class InvasiveSpecies:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
        self.age = 0
        self.alive = True

    def update(self, water_quality: float, wetland_capacity: float):
        self.age += 1
        if self.age > 200:
            if random.random() < (100 - wetland_capacity) / 150:
                self.alive = False
            elif random.random() < 0.5:
                self.alive = False
                return True
        return False

    def draw(self, screen):
        if self.alive:
            pygame.draw.circle(screen, RED, (int(self.x), int(self.y)), 4)
            pygame.draw.circle(screen, BLACK, (int(self.x), int(self.y)), 4, 1)

class Bird:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
        self.vx = random.uniform(-1.5, 1.5)
        self.vy = random.uniform(-1.5, 1.5)
        self.energy = 80
        self.age = 0
        self.nesting_site = None

    def update(self, state: State, bees: List['Bee'], flowers: List['Flower']):
        self.age += 1
        self.energy -= 0.3

        nearest_bee = None
        min_dist_bee = float('inf')
        for bee in bees:
            dist = math.sqrt((self.x - bee.x)**2 + (self.y - bee.y)**2)
            if dist < min_dist_bee:
                min_dist_bee = dist
                nearest_bee = bee

        if nearest_bee and min_dist_bee < 40:
            self.energy = min(100, self.energy + 15)
            return nearest_bee
        else:
            nearest_flower = None
            min_dist_flower = float('inf')
            for flower in flowers:
                dist = math.sqrt((self.x - flower.x)**2 + (self.y - flower.y)**2)
                if dist < min_dist_flower:
                    min_dist_flower = dist
                    nearest_flower = flower

            if nearest_flower and min_dist_flower < 35:
                self.energy = min(100, self.energy + 8)
            else:
                self.x += self.vx
                self.y += self.vy

                if self.x < 50 or self.x > WIDTH - 50:
                    self.vx *= -1
                if self.y < 50 or self.y > HEIGHT - 150:
                    self.vy *= -1

                self.x = max(50, min(WIDTH - 50, self.x))
                self.y = max(50, min(HEIGHT - 150, self.y))

        return None

    def draw(self, screen):
        color = (100, 100, 200) if self.energy > 50 else (150, 150, 200)
        pygame.draw.circle(screen, color, (int(self.x), int(self.y)), 5)
        pygame.draw.circle(screen, BLACK, (int(self.x), int(self.y)), 5, 2)

class WetlandGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Abejas & Humedal - Juego Ecológico")
        self.clock = pygame.time.Clock()
        self.font_small = pygame.font.Font(None, 24)
        self.font_large = pygame.font.Font(None, 32)

        self.state = State()
        self.bees: List[Bee] = [Bee(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)) for _ in range(self.state.bees)]
        self.flowers: List[Flower] = [Flower(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)) for _ in range(self.state.flowers)]
        self.invasive_species: List[InvasiveSpecies] = []
        self.birds: List[Bird] = [Bird(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)) for _ in range(3)]

        self.season_names = ["Primavera", "Verano", "Otoño", "Invierno"]
        self.game_running = True

    def update(self):
        if self.state.paused:
            return

        self.state.time += 1
        if self.state.time % 60 == 0:
            self.state.day += 1
            if self.state.day % 30 == 0:
                self.state.month += 1
                if self.state.month > 12:
                    self.state.month = 1
                    self.state.year += 1
            if self.state.day % 90 == 0:
                self.state.season = (self.state.season + 1) % 4

        if self.state.message_time > 0:
            self.state.message_time -= 1
        else:
            self.state.message = ""

        for bee in self.bees:
            bee.update(self.state, self.flowers)

        self.flowers = [f for f in self.flowers if f.alive]
        for flower in self.flowers:
            if flower.update(self.state.water_quality):
                self.state.flowers -= 1

        self.bees = [bee for bee in self.bees if bee.energy > 0 and bee.age < 3000]

        eaten_bee = None
        for bird in self.birds:
            eaten_bee = bird.update(self.state, self.bees, self.flowers)
            if eaten_bee:
                self.bees.remove(eaten_bee)

        self.birds = [b for b in self.birds if b.energy > 0 and b.age < 4000]

        bird_spawn_rate = 0.003 * (len(self.bees) / 100)
        if random.random() < bird_spawn_rate and len(self.birds) < 15:
            self.birds.append(Bird(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)))
            self.state.birds = len(self.birds)

        if len(self.birds) > 8:
            excess_birds = len(self.birds) - 8
            for _ in range(min(excess_birds, 2)):
                if random.random() < 0.5 and self.birds:
                    self.birds.pop()

        season = self.state.season
        if season == 0:
            flower_spawn_rate = 0.08
            bee_birth_rate = 0.02
        elif season == 1:
            flower_spawn_rate = 0.06
            bee_birth_rate = 0.03
        elif season == 2:
            flower_spawn_rate = 0.04
            bee_birth_rate = 0.01
        else:
            flower_spawn_rate = 0.01
            bee_birth_rate = 0.001

        if random.random() < flower_spawn_rate and len(self.flowers) < 200:
            self.flowers.append(Flower(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)))
            self.state.flowers += 1

        if random.random() < bee_birth_rate and len(self.bees) < 150:
            bee = random.choice(self.bees)
            self.bees.append(Bee(bee.x + random.randint(-20, 20), bee.y + random.randint(-20, 20)))
            self.state.bees = len(self.bees)

        self.invasive_species = [s for s in self.invasive_species if s.alive]
        for species in self.invasive_species:
            if species.update(self.state.water_quality, self.state.wetland_capacity):
                self.state.invasive_species -= 1

        invasive_spawn_rate = 0.006 * (1 + (100 - self.state.water_quality) / 200)
        if random.random() < invasive_spawn_rate and len(self.invasive_species) < 80:
            self.invasive_species.append(InvasiveSpecies(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)))
            self.state.invasive_species += 1

        if len(self.invasive_species) > 20:
            reduction_rate = 0.03 * (len(self.invasive_species) / 80)
            if random.random() < reduction_rate and len(self.flowers) > 0:
                idx = random.randint(0, len(self.flowers) - 1)
                self.flowers[idx].alive = False

        pollinated_flowers = sum(1 for f in self.flowers if f.pollinated)
        if pollinated_flowers > 0:
            self.state.food += pollinated_flowers * 2

        vegetation_health = len(self.flowers) / 200
        self.state.chlorophyll = 50 + (vegetation_health * 50) + (self.state.water_quality / 200)
        self.state.chlorophyll = max(0, min(100, self.state.chlorophyll))

        self.state.water_quality = min(100, self.state.water_quality + 0.15)
        if random.random() < 0.012:
            water_pollution = random.uniform(5, 20)
            self.state.water_quality -= water_pollution
            self.state.water_quality = max(0, self.state.water_quality)

        self.state.air_quality = min(100, self.state.air_quality + 0.08)
        if random.random() < 0.008:
            air_pollution = random.uniform(3, 12)
            self.state.air_quality -= air_pollution
            self.state.air_quality = max(0, self.state.air_quality)

        dead_biomass = (100 - self.state.water_quality) * 0.5 + len(self.invasive_species) * 0.3
        self.state.soil_microorganisms = 60 + (self.state.water_quality / 200) + (dead_biomass / 50)
        self.state.soil_microorganisms = max(0, min(100, self.state.soil_microorganisms))

        self.state.soil_nutrients = 70 + (self.state.soil_microorganisms / 200) - (len(self.flowers) * 0.2) - (len(self.bees) * 0.1)
        if random.random() < 0.005:
            self.state.soil_nutrients -= random.uniform(10, 20)
        self.state.soil_nutrients = max(0, min(100, self.state.soil_nutrients))

        if len(self.flowers) > 0:
            flower_effect = self.state.soil_nutrients / 200
            for flower in self.flowers:
                flower.pollinated = flower.pollinated or (random.random() < 0.01 * flower_effect)

        self.state.habitat_occupation = min(100, (len(self.bees) + len(self.flowers) + len(self.birds) + len(self.invasive_species)) / 5)

        total_biomass = len(self.bees) + len(self.flowers) + (len(self.invasive_species) * 1.2) + (len(self.birds) * 2)
        max_capacity = 350
        self.state.wetland_capacity = (total_biomass / max_capacity) * 100
        self.state.wetland_capacity = max(0, min(100, self.state.wetland_capacity))

        self.state.bees = len(self.bees)
        self.state.flowers = len(self.flowers)
        self.state.birds = len(self.birds)
        self.state.invasive_species = len(self.invasive_species)

    def draw(self):
        self.screen.fill(LIGHT_BLUE)

        pygame.draw.rect(self.screen, BLUE, (0, HEIGHT - 150, WIDTH, 150))

        for flower in self.flowers:
            flower.draw(self.screen)

        for species in self.invasive_species:
            species.draw(self.screen)

        for bird in self.birds:
            bird.draw(self.screen)

        for bee in self.bees:
            bee.draw(self.screen)

        self.draw_ui()

    def draw_ui(self):
        info_y = HEIGHT - 140

        def get_color(value):
            if value > 70:
                return GREEN
            elif value > 40:
                return ORANGE
            else:
                return RED

        invasive_color = RED if self.state.invasive_species > 30 else (ORANGE if self.state.invasive_species > 10 else BLACK)

        months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        month_name = months[self.state.month - 1] if 1 <= self.state.month <= 12 else "???"

        info_data = [
            (f"Año {self.state.year} - {month_name} (Día {self.state.day})", BLACK),
            (f"Estación: {self.season_names[self.state.season]}", BLACK),
            (f"Abejas: {self.state.bees}", BLACK),
            (f"Aves: {self.state.birds}", (100, 100, 200)),
            (f"Flores: {self.state.flowers}", BLACK),
            (f"Invasoras: {self.state.invasive_species}", invasive_color),
            (f"Clorofila: {self.state.chlorophyll:.1f}%", get_color(self.state.chlorophyll)),
            (f"Agua: {self.state.water_quality:.1f}%", get_color(self.state.water_quality)),
            (f"Aire: {self.state.air_quality:.1f}%", get_color(self.state.air_quality)),
            (f"Microorganismos: {self.state.soil_microorganisms:.1f}%", get_color(self.state.soil_microorganisms)),
            (f"Nutrientes: {self.state.soil_nutrients:.1f}%", get_color(self.state.soil_nutrients)),
            (f"Ocupación: {self.state.habitat_occupation:.1f}%", get_color(self.state.habitat_occupation)),
        ]

        for i, (text, color) in enumerate(info_data):
            text_surface = self.font_small.render(text, True, color)
            self.screen.blit(text_surface, (10 + (i % 3) * 380, info_y + (i // 3) * 30))

        if self.state.paused:
            pause_text = self.font_large.render("PAUSADO - Presiona ESPACIO para continuar", True, RED)
            text_rect = pause_text.get_rect(center=(WIDTH // 2, HEIGHT - 60))
            pygame.draw.rect(self.screen, WHITE, text_rect.inflate(20, 10))
            self.screen.blit(pause_text, text_rect)

        if self.state.message and self.state.message_time > 0:
            msg_text = self.font_small.render(self.state.message, True, ORANGE)
            msg_rect = msg_text.get_rect(center=(WIDTH // 2, 30))
            pygame.draw.rect(self.screen, WHITE, msg_rect.inflate(20, 10))
            self.screen.blit(msg_text, msg_rect)

        help_text = self.font_small.render("ESPACIO: Pausar | ↑↓: Abejas | W: Agua | A: Aire | P: Plantas | R: Reiniciar | Q: Salir", True, BLACK)
        self.screen.blit(help_text, (10, HEIGHT - 20))

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.game_running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.state.paused = not self.state.paused
                elif event.key == pygame.K_r:
                    self.__init__()
                elif event.key == pygame.K_q:
                    self.game_running = False
                elif event.key == pygame.K_UP and len(self.bees) < 150:
                    for _ in range(5):
                        self.bees.append(Bee(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)))
                    self.state.message = "✓ +5 Abejas agregadas"
                    self.state.message_time = 120
                elif event.key == pygame.K_DOWN and len(self.bees) > 0:
                    for _ in range(min(5, len(self.bees))):
                        self.bees.pop()
                    self.state.message = "✗ -5 Abejas removidas"
                    self.state.message_time = 120
                elif event.key == pygame.K_w:
                    self.state.water_quality -= 30
                    self.state.water_quality = max(0, self.state.water_quality)
                    self.state.message = "💧 Contaminación del agua inyectada"
                    self.state.message_time = 120
                elif event.key == pygame.K_a:
                    self.state.air_quality -= 25
                    self.state.air_quality = max(0, self.state.air_quality)
                    self.state.message = "💨 Contaminación del aire inyectada"
                    self.state.message_time = 120
                elif event.key == pygame.K_p:
                    for _ in range(random.randint(3, 8)):
                        self.flowers.append(Flower(random.randint(100, WIDTH-100), random.randint(100, HEIGHT-200)))
                    self.state.message = f"🌸 Flores germinadas (evento clima favorable)"
                    self.state.message_time = 120

    def run(self):
        while self.game_running:
            self.handle_events()
            self.update()
            self.draw()
            pygame.display.flip()
            self.clock.tick(FPS)

        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = WetlandGame()
    game.run()
