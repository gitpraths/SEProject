# GPU Setup Guide for Homeless Aid Platform

## Problem Identified

Your system has:
- ✓ NVIDIA RTX 3060 Mobile GPU (detected)
- ✓ NVIDIA drivers installed (version 580.95.05)
- ✓ PyTorch with CUDA support (2.9.0+cu128)
- ✗ **Missing: CUDA Runtime libraries (libcudart.so)**

## Solution: Install CUDA Toolkit

### Option 1: Install CUDA Toolkit 12.x (Recommended)

Since your PyTorch is built with CUDA 12.8, install a compatible CUDA toolkit:

```bash
# Add NVIDIA package repository
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update

# Install CUDA toolkit 12.x
sudo apt-get install cuda-toolkit-12-8

# Add CUDA to your PATH (add to ~/.bashrc for persistence)
export PATH=/usr/local/cuda-12.8/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda-12.8/lib64:$LD_LIBRARY_PATH
```

### Option 2: Install nvidia-cuda-toolkit (Easier but older version)

```bash
sudo apt-get install nvidia-cuda-toolkit
```

### Option 3: Use PyTorch's bundled CUDA (Simplest)

PyTorch comes with its own CUDA runtime. Set the library path:

```bash
# Find PyTorch's CUDA libraries
python -c "import torch; import os; print(os.path.dirname(torch.__file__))"

# Then add to your environment (replace <path> with output above):
export LD_LIBRARY_PATH=<path>/lib:$LD_LIBRARY_PATH
```

## After Installation

### 1. Verify CUDA is working:

```bash
cd homeless-aid-platform/backend
python test_gpu.py
```

### 2. Run the app with GPU:

```bash
./run_with_gpu.sh
```

Or manually:

```bash
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
python api/app.py
```

## Alternative: Switch to NVIDIA Mode

If you want the GPU always active (uses more power):

```bash
sudo prime-select nvidia
sudo reboot
```

Then check:

```bash
nvidia-smi  # Should now work
python test_gpu.py  # Should detect GPU
```

To switch back to on-demand mode:

```bash
sudo prime-select on-demand
sudo reboot
```

## Troubleshooting

### If nvidia-smi still doesn't work after switching to NVIDIA mode:

```bash
# Restart nvidia services
sudo systemctl restart nvidia-persistenced
sudo modprobe -r nvidia_uvm nvidia_drm nvidia_modeset nvidia
sudo modprobe nvidia nvidia_modeset nvidia_drm nvidia_uvm
```

### If PyTorch still can't find CUDA:

```bash
# Check PyTorch's CUDA libraries
python -c "import torch; print(torch.__file__)"
ls -la <output_path>/lib/ | grep cuda

# If libcudart.so exists there, add to LD_LIBRARY_PATH:
export LD_LIBRARY_PATH=<output_path>/lib:$LD_LIBRARY_PATH
```

## Quick Test

After setup, run this to verify:

```bash
python -c "import torch; print('CUDA available:', torch.cuda.is_available()); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'N/A')"
```

Expected output:
```
CUDA available: True
GPU: NVIDIA GeForce RTX 3060 Mobile / Max-Q
```
