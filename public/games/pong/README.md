# Pong — DQN Self-Play
Two DQN agents train against each other in self-play. They are bootstrapped with an
analytic intercept policy and anchored to it during training (EWC-style), so they keep
fine-tuning without the catastrophic forgetting that makes self-play agents collapse.
Live Q-value bars and network shown on the right.
Open index.html in any browser. No install needed.
