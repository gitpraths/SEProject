#!/usr/bin/env python
"""Detailed CUDA diagnostics."""

import sys
import os

print("=" * 70)
print("CUDA Environment Diagnostics")
print("=" * 70)

# Check environment variables
print("\n1. Environment Variables:")
print(f"   LD_LIBRARY_PATH: {os.environ.get('LD_LIBRARY_PATH', 'Not set')}")
print(f"   CUDA_VISIBLE_DEVICES: {os.environ.get('CUDA_VISIBLE_DEVICES', 'Not set')}")
print(f"   CUDA_HOME: {os.environ.get('CUDA_HOME', 'Not set')}")

# Check PyTorch
print("\n2. PyTorch Information:")
try:
    import torch
    print(f"   PyTorch version: {torch.__version__}")
    print(f"   PyTorch CUDA compiled version: {torch.version.cuda}")
    print(f"   PyTorch built with CUDA: {torch.cuda.is_available()}")
    
    # Try to get more detailed error
    if not torch.cuda.is_available():
        print("\n3. Detailed CUDA Check:")
        try:
            # This might give us more info
            torch.cuda.init()
        except Exception as e:
            print(f"   Error initializing CUDA: {e}")
            
        # Check if CUDA libraries can be loaded
        try:
            import ctypes
            libcuda = ctypes.CDLL("libcuda.so.1")
            print("   ✓ libcuda.so.1 can be loaded")
        except Exception as e:
            print(f"   ✗ Cannot load libcuda.so.1: {e}")
            
        try:
            import ctypes
            libcudart = ctypes.CDLL("libcudart.so")
            print("   ✓ libcudart.so can be loaded")
        except Exception as e:
            print(f"   ✗ Cannot load libcudart.so: {e}")
            
except ImportError as e:
    print(f"   Error importing torch: {e}")
    sys.exit(1)

# Check for CUDA runtime libraries
print("\n4. CUDA Runtime Libraries:")
import subprocess

libs_to_check = [
    "/usr/lib/x86_64-linux-gnu/libcuda.so.1",
    "/usr/lib/x86_64-linux-gnu/libcudart.so",
    "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1",
]

for lib in libs_to_check:
    exists = os.path.exists(lib)
    symbol = "✓" if exists else "✗"
    print(f"   {symbol} {lib}: {'Found' if exists else 'Not found'}")

# Check nvidia-smi
print("\n5. NVIDIA Driver Status:")
try:
    result = subprocess.run(['nvidia-smi'], capture_output=True, text=True, timeout=5)
    if result.returncode == 0:
        print("   ✓ nvidia-smi works")
    else:
        print(f"   ✗ nvidia-smi failed: {result.stderr}")
except Exception as e:
    print(f"   ✗ nvidia-smi error: {e}")

# Check kernel modules
print("\n6. NVIDIA Kernel Modules:")
try:
    result = subprocess.run(['lsmod'], capture_output=True, text=True)
    nvidia_mods = [line for line in result.stdout.split('\n') if 'nvidia' in line.lower()]
    if nvidia_mods:
        print("   ✓ NVIDIA modules loaded:")
        for mod in nvidia_mods[:5]:
            print(f"     {mod.split()[0]}")
    else:
        print("   ✗ No NVIDIA modules found")
except Exception as e:
    print(f"   Error checking modules: {e}")

print("\n" + "=" * 70)
print("Diagnosis complete")
print("=" * 70)

# Recommendations
print("\nRecommendations:")
if not torch.cuda.is_available():
    print("  The most common issue with hybrid graphics laptops is that the")
    print("  NVIDIA GPU needs to be explicitly enabled. Try:")
    print()
    print("  Option 1: Switch to NVIDIA mode permanently")
    print("    sudo prime-select nvidia")
    print("    (requires reboot)")
    print()
    print("  Option 2: Check if nvidia-persistenced is running")
    print("    sudo systemctl status nvidia-persistenced")
    print()
    print("  Option 3: Verify CUDA toolkit compatibility")
    print("    Your PyTorch is built with CUDA 12.8")
    print("    Check if compatible CUDA runtime is installed")
