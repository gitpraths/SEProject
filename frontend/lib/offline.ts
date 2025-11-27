// Offline sync utilities
import localforage from 'localforage';

const PENDING_QUEUE_KEY = 'pending_sync_queue';

interface PendingRequest {
  id: string;
  url: string;
  method: string;
  data: any;
  timestamp: Date;
}

export async function addToPendingQueue(url: string, method: string, data: any) {
  try {
    const queue = await getPendingQueue();
    const request: PendingRequest = {
      id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      method,
      data,
      timestamp: new Date(),
    };
    
    queue.push(request);
    await localforage.setItem(PENDING_QUEUE_KEY, queue);
    return request;
  } catch (error) {
    console.error('Failed to add to pending queue:', error);
    return null;
  }
}

export async function getPendingQueue(): Promise<PendingRequest[]> {
  try {
    return await localforage.getItem<PendingRequest[]>(PENDING_QUEUE_KEY) || [];
  } catch (error) {
    console.error('Failed to get pending queue:', error);
    return [];
  }
}

export async function getPendingCount(): Promise<number> {
  const queue = await getPendingQueue();
  return queue.length;
}

export async function syncPending() {
  const queue = await getPendingQueue();
  
  if (queue.length === 0) {
    return { success: true, synced: 0 };
  }

  let synced = 0;
  const remaining: PendingRequest[] = [];

  for (const request of queue) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.data),
      });

      if (response.ok) {
        synced++;
      } else {
        remaining.push(request);
      }
    } catch (error) {
      remaining.push(request);
    }
  }

  await localforage.setItem(PENDING_QUEUE_KEY, remaining);
  
  return { success: true, synced, remaining: remaining.length };
}

export async function clearPendingQueue() {
  try {
    await localforage.removeItem(PENDING_QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear pending queue:', error);
  }
}
