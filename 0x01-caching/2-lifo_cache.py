#!/usr/bin/env python3
"""
Last-In First-Out (LIFO) caching module.
Implements a caching system where items are removed in LIFO order
when the cache limit is reached.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFOCache class that inherits from BaseCaching.
    Implements a LIFO eviction policy when adding new items.
    """

    def __init__(self):
        """
        Initializes the LIFOCache.
        The cache uses an OrderedDict to maintain the order of insertion.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        Adds an item to the cache.
        
        If the cache exceeds the limit defined by BaseCaching.MAX_ITEMS,
        the most recently added item (Last-In) is removed (LIFO removal policy).
        
        Args:
            key (str): The key under which the item will be stored.
            item (any): The item to be cached.

        If either key or item is None, the method does nothing.
        """
        if key is None or item is None:
            return

        # If the cache is full and the key is not already in the cache, remove the last added item (LIFO)
        if key not in self.cache_data and len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            last_key, _ = self.cache_data.popitem(last=True)  # Remove the last item
            print(f"DISCARD: {last_key}")

        # Add or update the cache with the new item
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)  # Ensure the item is treated as the last added

    def get(self, key):
        """
        Retrieves an item from the cache by its key.
        
        Args:
            key (str): The key associated with the item to retrieve.
        
        Returns:
            The cached item if found, otherwise None.
        """
        return self.cache_data.get(key)

