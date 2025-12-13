# Linear Search

## Overview
Linear search is the simplest searching algorithm that checks each element of the array one by one until the target is found or the end of the array is reached.

## Time Complexity
- **Best Case**: O(1) - Element found at the first position
- **Average Case**: O(n/2) - On average, need to check half of the elements
- **Worst Case**: O(n) - Element not found or at the last position

## Space Complexity
- O(1) - Constant space regardless of input size

## When to Use
- Small datasets
- Unsorted arrays
- When simplicity is preferred over efficiency
- When the overhead of more complex algorithms isn't justified

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // Element not found
}

// Example usage
int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    int target = 12;
    
    int result = linearSearch(arr, target);
    
    if (result != -1) {
        std::cout << "Element found at index " << result << std::endl;
    } else {
        std::cout << "Element not found in the array" << std::endl;
    }
    
    return 0;
}
```

## Advantages
1. Simple to implement and understand
2. Works on unsorted arrays
3. No prerequisites (like sorting) needed
4. More efficient for small datasets

## Disadvantages
1. Inefficient for large datasets
2. Much slower than binary search for sorted arrays
3. Always checks elements sequentially, even if the target is at the end

## Applications
1. Finding an element in a small unsorted list
2. One-time searches where the overhead of sorting and using binary search isn't worthwhile
3. Searching in data structures where random access isn't available (like linked lists)
4. Searching for multiple values in an unsorted array where sorting would be costlier