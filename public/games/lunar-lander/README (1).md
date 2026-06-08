# Lunar Lander NEAT — v2 Upgrade Notes

## Files changed

| File | Status |
|------|--------|
| neat.js | Rewritten |
| main.js | Rewritten |
| nn-draw.js | Rewritten |
| pause.js | Unchanged |

---

## neat.js — AI model improvements

### Deeper network  (8 inputs → 9 → H1·ReLU(16) → H2·tanh(10) → OUT·sigmoid(3))
The old single-hidden-layer design (8→14→3) is replaced by a two-hidden-layer
network. The first layer uses ReLU (good for sparse, non-negative signals like
distances). The second layer uses tanh (bounded ±1, better for signed feedback
like velocity and angle before the output).

### Recurrent memory neuron
The average activation of H2 is carried as a scalar into the *next* frame's
input vector (9th input). This gives the lander a rudimentary short-term
memory so it can learn from temporal patterns (e.g. "am I improving or
getting worse?") rather than treating every frame independently.

### Adaptive mutation strength
Mutation starts at ±0.40 and anneals down toward ±0.05 as `bestEver` climbs.
This mimics simulated annealing: explore broadly early, then fine-tune once
good solutions are found.

### Hall of Fame
The single best-ever genome is cloned and reseeded into every new generation.
Good discoveries can never be completely lost to genetic drift or stale-species
pruning.

### Elite preservation
The top `ELITE_N` (3) members of each species survive to the next generation
unmutated. This stabilises high-performing lineages between generations.

### Adaptive compatibility threshold (CT)
CT adjusts ±0.1 each generation to keep species count in [4, 7].
Too few species → monoculture; too many → fragmentation.

### Weight clamping
All weights are clamped to [−3, 3] after mutation to prevent runaway values
that saturate activations.

---

## main.js — Fitness / simulation improvements

### Closing-distance reward
Each frame the lander moves closer to the pad it earns +0.08; moving away
costs −0.02. This provides a dense gradient signal instead of sparse
end-of-episode rewards.

### Stability bonus near pad
When the lander is within 120 px of the pad it earns +0.06/frame but is
penalised for angle (×0.15) and angular velocity (×0.30). This teaches
the AI to stabilise *before* descending.

### Fuel efficiency penalty
Each frame the main thruster fires costs −0.01. Over an episode this
pressures the AI to conserve fuel and plan efficient trajectories.

### Precision landing bonuses
Speed bonus (up to +100), angle bonus (up to +60), and fuel bonus (up to +30)
replace the simpler v1 bonuses to reward smooth, well-aligned, efficient
landings more than brute-force ones.

### Species colour tracking
Landers pull their colour from `neat.species` so colours stay consistent
with the NN panel and match evolving species.

---

## nn-draw.js — Visualisation improvements

- Draws all 4 layers: IN+MEM / H1·ReLU / H2·tanh / OUT
- Memory input node (#9) highlighted in amber
- Live MEM value displayed at top of panel
- H1→H2 edges thinned (every other source node drawn) to avoid overdrawing
- Layer activation function labels at bottom of each column

---

## HTML changes required (add to your `<head>` / HUD)

The following optional stat elements are read by main.js if present:

```html
<span id="s-spec">1</span>   <!-- species count -->
<span id="s-mut">0.40</span> <!-- mutation strength -->
```

Load order must remain:
```html
<script src="pause.js"></script>
<script src="neat.js"></script>
<script src="nn-draw.js"></script>
<script src="main.js"></script>
```
