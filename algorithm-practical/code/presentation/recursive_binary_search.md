# Recursive Binary Search

## Overview
Recursive binary search is a divide-and-conquer algorithm for finding a target value in a sorted array. Unlike the iterative version, it uses recursive function calls to repeatedly divide the search space in half.

## Time Complexity
- **Best Case**: O(1) - Element found at the middle on first recursion
- **Average Case**: O(log n) - Logarithmic time complexity
- **Worst Case**: O(log n) - When the element is not present or at the edges

## Space Complexity
- O(log n) - Due to the function call stack in recursion

## When to Use
- Sorted arrays
- When clean, elegant code is preferred over space efficiency
- When the array size is moderate (to avoid stack overflow)
- When the recursive approach fits better with surrounding algorithms

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

int binarySearchRecursiveHelper(const std::vector<int>& arr, int left, int right, int target) {
    if (left <= right) {
        int mid = left + (right - left) / 2;
        
        // If the element is present at the middle
        if (arr[mid] == target) {
            return mid;
        }
        
        // If element is smaller than mid, search in left subarray
        if (arr[mid] > target) {
            return binarySearchRecursiveHelper(arr, left, mid - 1, target);
        }
        
        // Else search in right subarray
        return binarySearchRecursiveHelper(arr, mid + 1, right, target);
    }
    
    // Element not found
    return -1;
}

int binarySearchRecursive(const std::vector<int>& arr, int target) {
    return binarySearchRecursiveHelper(arr, 0, arr.size() - 1, target);
}

// Example usage
int main() {
    std::vector<int> arr = {11, 12, 22, 25, 34, 64, 90};
    int target = 25;
    
    int result = binarySearchRecursive(arr, target);
    
    if (result != -1) {
        std::cout << "Element found at index " << result << std::endl;
    } else {
        std::cout << "Element not found in the array" << std::endl;
    }
    
    return 0;
}
```

## Advantages
1. Clean and elegant implementation
2. Very efficient for large sorted datasets
3. Follows the divide-and-conquer paradigm clearly
4. Easy to understand the logical flow

## Disadvantages
1. Uses O(log n) space due to recursion stack
2. Risk of stack overflow for very large arrays
3. Requires sorted array
4. Slightly less efficient than iterative version due to function call overhead

## Applications
1. Used in implementing algorithms where recursion is the natural approach
2. Used when the added space complexity is acceptable
3. Teaching and demonstrating the divide-and-conquer paradigm
4. Scenarios where code clarity is prioritized over marginal performance gains