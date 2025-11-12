#!/usr/bin/env python
"""Test script to verify GPU detection and availability."""

import torch
import sys

print("=" * 60)
print("GPU Detection Test")
print("=" * 60)

# PyTorch version
print(f"\nPyTorch version: {torch.__version__}")

# CUDA availability
cuda_available = torch.cuda.is_available()
print(f"CUDA available: {cuda_available}")

if cuda_available:
    print(f"CUDA version: {torch.version.cuda}")
    print(f"cuDNN version: {torch.backends.cudnn.version()}")
    print(f"GPU count: {torch.cuda.device_count()}")
    
    for i in range(torch.cuda.device_count()):
        print(f"\nGPU {i}:")
        print(f"  Name: {torch.cuda.get_device_name(i)}")
        print(f"  Compute Capability: {torch.cuda.get_device_capability(i)}")
        
        # Memory info
        total_memory = torch.cuda.get_device_properties(i).total_memory / 1024**3
        print(f"  Total Memory: {total_memory:.2f} GB")
        
    # Test tensor operation on GPU
    print("\n" + "=" * 60)
    print("Testing GPU tensor operations...")
    print("=" * 60)
    
    try:
        # Create tensors on GPU
        x = torch.randn(1000, 1000, device='cuda')
        y = torch.randn(1000, 1000, device='cuda')
        
        # Perform operation
        z = torch.matmul(x, y)
        
        print("✓ Successfully created tensors on GPU")
        print("✓ Successfully performed matrix multiplication on GPU")
        print(f"✓ Result tensor shape: {z.shape}")
        print(f"✓ Result tensor device: {z.device}")
        
        # Benchmark
        import time
        
        # GPU benchmark
        torch.cuda.synchronize()
        start = time.time()
        for _ in range(100):
            z = torch.matmul(x, y)
        torch.cuda.synchronize()
        gpu_time = time.time() - start
        
        # CPU benchmark
        x_cpu = x.cpu()
        y_cpu = y.cpu()
        start = time.time()
        for _ in range(100):
            z_cpu = torch.matmul(x_cpu, y_cpu)
        cpu_time = time.time() - start
        
        print(f"\nPerformance comparison (100 matrix multiplications):")
        print(f"  GPU time: {gpu_time:.4f} seconds")
        print(f"  CPU time: {cpu_time:.4f} seconds")
        print(f"  Speedup: {cpu_time/gpu_time:.2f}x")
        
    except Exception as e:
        print(f"✗ Error during GPU operations: {e}")
        sys.exit(1)
        
else:
    print("\n⚠ CUDA is not available. Possible reasons:")
    print("  1. PyTorch was installed without CUDA support")
    print("  2. NVIDIA drivers are not installed or not working")
    print("  3. GPU is not being used (hybrid graphics in on-demand mode)")
    print("\nTo fix:")
    print("  - For hybrid graphics, run with: __NV_PRIME_RENDER_OFFLOAD=1 python test_gpu.py")
    print("  - Or switch to NVIDIA mode: sudo prime-select nvidia")
    print("  - Reinstall PyTorch with CUDA: pip install torch --index-url https://download.pytorch.org/whl/cu118")
    sys.exit(1)

print("\n" + "=" * 60)
print("✓ All GPU tests passed!")
print("=" * 60)
