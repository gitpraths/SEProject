# Quick Guide: Enable GPU Right Now

## The Issue

Your laptop has hybrid graphics (AMD + NVIDIA RTX 3060). Currently in "on-demand" mode, the NVIDIA GPU is not accessible to CUDA applications.

## Immediate Solution (Recommended)

### Step 1: Switch to NVIDIA Mode

```bash
sudo prime-select nvidia
```

### Step 2: Reboot

```bash
sudo reboot
```

### Step 3: Verify GPU is Working

After reboot:

```bash
nvidia-smi
```

You should see your RTX 3060 with memory usage and temperature.

### Step 4: Test PyTorch

```bash
cd ~/Desktop/SE_Project/homeless-aid-platform/backend
source venv/bin/activate
python test_gpu.py
```

You should see:
```
CUDA available: True
GPU 0:
  Name: NVIDIA GeForce RTX 3060 Mobile / Max-Q
  ...
✓ All GPU tests passed!
```

### Step 5: Run Your App

```bash
python api/app.py
```

You should now see:
```
NLPAnalyzer using device: GPU (cuda)
SmartQuestionnaire using device: cuda
RiskPredictor using device: cuda
RouteOptimizer using device: cuda
RecommendationEngine using device: cuda
MultiArmedBandit using device: cuda
RecommendationScorer using device: cuda
```

## Alternative: Stay in On-Demand Mode (More Complex)

If you want to keep on-demand mode (better battery life), you need to install CUDA toolkit:

```bash
# Install CUDA toolkit
sudo apt-get update
sudo apt-get install nvidia-cuda-toolkit

# Then run with library path set
export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
python api/app.py
```

## Switching Back to On-Demand Mode Later

If you want to switch back after testing:

```bash
sudo prime-select on-demand
sudo reboot
```

## Why This Happens

- **On-demand mode**: GPU is powered off by default, only used for graphics rendering
- **NVIDIA mode**: GPU is always on and available for CUDA applications
- **Hybrid graphics**: Designed to save battery, but makes CUDA setup more complex

## Recommendation

For development and testing, use **NVIDIA mode**. For production deployment on a server, this won't be an issue as servers typically don't have hybrid graphics.
