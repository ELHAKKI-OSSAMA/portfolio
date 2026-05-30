import type { TopicContent } from './types';

export const rlContent: Record<string, TopicContent> = {

  "reinforcement-learning": {
    id: "reinforcement-learning",
    tagline: "An agent learns by doing — maximising cumulative reward through trial-and-error interaction",
    taglineFr: "Un agent apprend en faisant — maximiser la récompense cumulée par interaction essai-erreur",
    taglineAr: "وكيل يتعلم بالفعل — تعظيم المكافأة التراكمية من خلال التفاعل بالتجربة والخطأ",
    accentColor: "#f43f5e",
    visualization: "q-learning",
    keyFormulas: [
      { name: "Bellman Equation", latex: "Q^*(s,a) = r + \\gamma \\max_{a'} Q^*(s',a')", meaning: "Optimal Q-value: immediate reward + discounted best future value. The recursive target Q-learning converges to" },
      { name: "Q-Learning Update", latex: "Q(s,a) \\leftarrow Q(s,a) + \\alpha\\left[r + \\gamma\\max_{a'}Q(s',a') - Q(s,a)\\right]", meaning: "Move current estimate toward the Bellman target by step size α (temporal difference learning)" },
      { name: "Policy Gradient (REINFORCE)", latex: "\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\tau}\\left[\\sum_t G_t \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t)\\right]", meaning: "Increase probability of actions that led to high returns, decrease for low-return actions" },
      { name: "PPO Clipped Objective", latex: "L^{\\text{CLIP}} = \\mathbb{E}_t\\!\\left[\\min\\!\\left(r_t(\\theta)A_t,\\;\\text{clip}(r_t,1\\!-\\!\\varepsilon,1\\!+\\!\\varepsilon)A_t\\right)\\right]", meaning: "Proximal Policy Optimization: clips the policy update ratio to stay within [1-ε, 1+ε] — stable large-batch training" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Learning by Doing — the RL Paradigm",
        text: "Supervised learning needs labelled examples. Reinforcement learning needs only a reward signal — feedback on whether an action was good or bad. This is how humans learn to walk, play games, and drive: through practice, feedback, and gradually improving strategy. RL successes: AlphaGo defeated the world Go champion (2016) — trained by RL after supervised pre-training. AlphaFold's structure refinement uses RL-like optimization. ChatGPT / GPT-4 use RLHF (Reinforcement Learning from Human Feedback) to align model outputs with human preferences. Robotic manipulation systems (Boston Dynamics, Figure AI) train policies in simulation then transfer to real hardware.",
        callout: "DeepMind's AlphaZero learned Chess, Go, and Shogi to superhuman level in 24 hours of self-play — no human game records, pure RL from random play and the reward of winning.",
      },
      {
        type: "intuition",
        heading: "The RL Framework: Agent, Environment, MDP",
        text: "**Markov Decision Process (MDP):** (S, A, T, R, γ) — States S, Actions A, Transition function T(s'|s,a), Reward R(s,a,s'), discount γ∈[0,1]. **Agent:** At each timestep t, observes state sₜ, takes action aₜ according to policy π(aₜ|sₜ), receives reward rₜ. **Goal:** Find policy π* that maximises expected discounted return Gₜ = Σᵢ γⁱrₜ₊ᵢ. **Q-function Q(s,a):** Expected return starting from state s, taking action a, then following the optimal policy. If we knew Q*, we'd always pick argmax_a Q*(s,a). **Key distinction:** Model-free RL (Q-learning, PPO) learns directly from interaction without knowing T. Model-based RL (Dyna, MuZero) learns a world model T̂ and plans in imagination.",
        callout: "The discount factor γ controls myopia: γ=0.99 makes the agent care about rewards 100 steps in the future; γ=0 is purely greedy (only cares about immediate reward). Most problems need γ∈[0.95, 0.999].",
      },
      {
        type: "algorithm",
        heading: "Q-Learning: Tabular and Deep (DQN)",
        steps: [
          "Initialize Q-table Q(s,a)=0 for all state-action pairs (tabular) or Q-network θ (DQN).",
          "For each episode: reset environment, observe initial state s.",
          "ε-greedy action selection: with probability ε pick random action (exploration), else pick argmax_a Q(s,a) (exploitation). Anneal ε from 1.0 → 0.05 over training.",
          "Execute action a, observe reward r and next state s'. Store (s,a,r,s') in replay buffer (DQN).",
          "TD update: Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)].",
          "DQN extras: (1) Experience replay — sample random minibatches from buffer to break correlations. (2) Target network — use a frozen copy Q_target(θ⁻) as the update target, sync every N steps. (3) Double DQN — decouple action selection from value estimation to reduce overestimation.",
          "Convergence: tabular Q-learning converges to Q* for finite MDPs with sufficient exploration and decaying α. Neural Q-networks are not guaranteed but work well in practice.",
        ],
      },
      {
        type: "code",
        heading: "Q-Learning and DQN from Scratch",
        language: "python",
        code: `import numpy as np
import gymnasium as gym
from collections import deque
import torch, torch.nn as nn, torch.optim as optim

# ── 1. Tabular Q-Learning (FrozenLake) ───────────────────────────────────────
env = gym.make("FrozenLake-v1", is_slippery=False)
n_states, n_actions = env.observation_space.n, env.action_space.n

Q = np.zeros((n_states, n_actions))
alpha = 0.8          # learning rate
gamma = 0.95         # discount
epsilon = 1.0        # exploration rate

for episode in range(2000):
    s, _ = env.reset()
    done = False
    while not done:
        # ε-greedy
        if np.random.random() < epsilon:
            a = env.action_space.sample()
        else:
            a = np.argmax(Q[s])

        s_next, r, terminated, truncated, _ = env.step(a)
        done = terminated or truncated

        # Q-learning update (Bellman target)
        td_target = r + gamma * np.max(Q[s_next]) * (1 - terminated)
        Q[s, a] += alpha * (td_target - Q[s, a])
        s = s_next

    epsilon = max(0.01, epsilon * 0.999)   # decay exploration

# Evaluate greedy policy
n_wins = 0
for _ in range(100):
    s, _ = env.reset()
    done = False
    while not done:
        a = np.argmax(Q[s])
        s, r, terminated, truncated, _ = env.step(a)
        done = terminated or truncated
    if r == 1.0:      # reached the goal
        n_wins += 1
print(f"Win rate: {n_wins/100:.0%}")

# ── 2. Deep Q-Network (CartPole) ─────────────────────────────────────────────
class DQN(nn.Module):
    def __init__(self, obs_dim, n_actions):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_dim, 128), nn.ReLU(),
            nn.Linear(128, 128),    nn.ReLU(),
            nn.Linear(128, n_actions)
        )
    def forward(self, x): return self.net(x)

env = gym.make("CartPole-v1")
obs_dim = env.observation_space.shape[0]
n_actions = env.action_space.n

q_net    = DQN(obs_dim, n_actions)
q_target = DQN(obs_dim, n_actions)    # frozen target network
q_target.load_state_dict(q_net.state_dict())

optimizer  = optim.Adam(q_net.parameters(), lr=1e-3)
replay     = deque(maxlen=10_000)     # experience replay buffer
gamma      = 0.99
epsilon    = 1.0
batch_size = 64
target_update_freq = 100
steps = 0

for episode in range(500):
    s, _ = env.reset()
    total_reward = 0
    done = False
    while not done:
        # ε-greedy action
        if np.random.random() < epsilon:
            a = env.action_space.sample()
        else:
            with torch.no_grad():
                a = q_net(torch.FloatTensor(s)).argmax().item()

        s_next, r, terminated, truncated, _ = env.step(a)
        done = terminated or truncated
        replay.append((s, a, r, s_next, terminated))
        s = s_next; total_reward += r; steps += 1

        # Train when buffer has enough samples
        if len(replay) >= batch_size:
            batch = [replay[i] for i in np.random.choice(len(replay), batch_size, replace=False)]
            S, A, R, S_next, D = map(np.array, zip(*batch))
            S_t = torch.FloatTensor(S); A_t = torch.LongTensor(A)
            R_t = torch.FloatTensor(R); S_next_t = torch.FloatTensor(S_next)
            D_t = torch.FloatTensor(D)

            with torch.no_grad():
                max_next_q = q_target(S_next_t).max(1)[0]
                target = R_t + gamma * max_next_q * (1 - D_t)

            current_q = q_net(S_t).gather(1, A_t.unsqueeze(1)).squeeze()
            loss = nn.functional.mse_loss(current_q, target)
            optimizer.zero_grad(); loss.backward(); optimizer.step()

        if steps % target_update_freq == 0:
            q_target.load_state_dict(q_net.state_dict())

    epsilon = max(0.05, epsilon * 0.995)
    if episode % 50 == 0:
        print(f"Episode {episode:4d} | reward={total_reward:5.0f} | ε={epsilon:.3f}")`,
      },
      {
        type: "math",
        heading: "Policy Gradient and Actor-Critic (A2C/PPO)",
        formula: `A_t = R_t - V(s_t)  \\quad\\text{(advantage = return - baseline)}
\\\\[6pt]
\\mathcal{L}^{A2C} = \\underbrace{-\\hat{A}_t \\log \\pi_\\theta(a_t|s_t)}_{\\text{policy loss}} + \\underbrace{c_1(V_\\theta(s_t)-R_t)^2}_{\\text{value loss}} - \\underbrace{c_2 H(\\pi_\\theta)}_{\\text{entropy bonus}}`,
        text: "Policy gradient methods directly optimise the policy π_θ instead of a value function. The actor-critic architecture uses two networks: the actor π_θ selects actions, the critic V_φ estimates state values as a baseline to reduce gradient variance. PPO (Proximal Policy Optimization) adds a clipping mechanism to prevent destructively large policy updates — the ratio r_t(θ) = π_θ(a|s)/π_θ_old(a|s) is clipped to [1-ε, 1+ε]. This makes PPO sample-efficient enough for practical use and is the standard algorithm in RLHF for LLMs.",
      },
      {
        type: "pitfall",
        heading: "The Deadly Triad and Common RL Failure Modes",
        text: "The deadly triad (Sutton & Barto): combining (1) function approximation (neural networks), (2) bootstrapping (TD updates), and (3) off-policy learning can cause divergence. DQN avoids this with replay buffers and target networks but training can still be unstable. Practical RL pitfalls: (1) Reward shaping can introduce unintended shortcuts — the boat racing agent that learned to spin in circles collecting bonuses. (2) Sparse rewards make exploration nearly impossible — use intrinsic motivation (curiosity) or reward shaping carefully. (3) Sim-to-real gap — policies trained in simulation fail on real robots due to unmodelled physics. (4) Evaluation with fixed seeds is misleading — RL results have high variance; report mean ± std over 10+ seeds.",
        callout: "OpenAI's boat racing agent trained with shaping rewards learned to drive in circles collecting bonus items instead of finishing the race — a famous reward hacking failure.",
      },
    ],
  },

};
