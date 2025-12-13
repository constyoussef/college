# Iterative Binary Search

## Overview
Binary search is an efficient algorithm for finding a target value in a sorted array. The iterative version uses a loop instead of recursion to repeatedly divide the search space in half.

## Time Complexity
- **Best Case**: O(1) - Element found at the middle on first attempt
- **Average Case**: O(log n) - Logarithmic time complexity
- **Worst Case**: O(log n) - When the element is not present or at the edges

## Space Complexity
- O(1) - Constant space regardless of input size (advantage over recursive version)

## When to Use
- Sorted arrays
- Large datasets where efficiency is important
- When recursion is not preferred due to stack overflow concerns
- When constant space complexity is required

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

int binarySearchIterative(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        // Check if target is present at mid
        if (arr[mid] == target) {
            return mid;
        }
        
        // If target is greater, ignore left half
        if (arr[mid] < target) {
            left = mid + 1;
        }
        // If target is smaller, ignore right half
        else {
            right = mid - 1;
        }
    }
    
    return -1; // Element not found
}

// Example usage
int main() {
    std::vector<int> arr = {11, 12, 22, 25, 34, 64, 90};
    int target = 25;
    
    int result = binarySearchIterative(arr, target);
    
    if (result != -1) {
        std::cout << "Element found at index " << result << std::endl;
    } else {
        std::cout << "Element not found in the array" << std::endl;
    }
    
    return 0;
}
```

## Advantages
1. Very efficient for large sorted datasets
2. O(log n) time complexity is much better than linear search
3. Uses constant O(1) space (better than recursive version)
4. No risk of stack overflow for very large arrays

## Disadvantages
1. Requires sorted array
2. Cost of sorting may outweigh binary search benefits for one-time searches
3. Not suitable for data structures that don't support random access (like linked lists)

## Applications
1. Dictionary lookup
2. Finding entries in sorted databases
3. Implementation in standard libraries (e.g., std::binary_search in C++)
4. Finding insertion positions in sorted data structures