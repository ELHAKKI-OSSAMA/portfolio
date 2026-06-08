# Maze Solver — A* Imitation Learning + 5-Net Ensemble
A 5-network ensemble (majority vote per step) trained by A* imitation + DAgger on a
5×5 → 21×21 curriculum solves any random maze — 100% solve rate (verified 500/500 on
fresh 21×21 mazes). Inputs include an A* cost-to-go signal. Live network panel shows the
ensemble's real activations; pheromone trails glow on the chosen path.
Open index.html in any browser. No install needed.
