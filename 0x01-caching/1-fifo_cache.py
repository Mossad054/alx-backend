#!/usr/bin/env python3
"""
First-In First-Out (FIFO) caching module.
Implements a caching system where items are removed in FIFO order
when the cache limit is reached.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    FIFOCache class that inherits from BaseCaching.
    Implements a FIFO eviction policy when adding new items.
    """

    def __init__(self):
        """
        Initializes the FIFOCache.
        The cache uses an OrderedDict to maintain the order of insertion.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        Adds an item to the cache.
        
        If the cache exceeds the limit defined by BaseCaching.MAX_ITEMS,
        the first added item is removed (FIFO removal policy).
        
        Args:
            key (str): The key under which the item will be stored.
            item (any): The item to be cached.

        If either key or item is None, the method does nothing.
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

        # If the cache exceeds the limit, remove the first item (FIFO)
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first_key, _ = self.cache_data.popitem(last=False)  # Remove the first item
            print(f"DISCARD: {first_key}")

    def get(self, key):
        """
        Retrieves an item from the cache by its key.
        
        Args:
            key (str): The key associated with the item to retrieve.
        
        Returns:
            The cached item if found, otherwise None.
        """
        return self.cache_data.get(key)

