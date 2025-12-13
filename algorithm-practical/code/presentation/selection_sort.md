# Selection Sort

## Overview
Selection sort is a simple comparison-based sorting algorithm. It divides the input list into two parts: a sorted sublist and an unsorted sublist. The algorithm repeatedly finds the minimum element from the unsorted sublist and moves it to the beginning of the unsorted sublist.

## Time Complexity
- **Best Case**: O(n²) - Even if the array is already sorted
- **Average Case**: O(n²) - Quadratic time complexity
- **Worst Case**: O(n²) - When the array is reverse sorted

## Space Complexity
- O(1) - In-place sorting algorithm that uses constant extra space

## When to Use
- Small datasets
- When memory usage is a concern
- When code simplicity is preferred
- When the cost of swapping elements is high (selection sort makes O(n) swaps)

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in the unsorted part
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        
        // Swap the found minimum element with the element at position i
        std::swap(arr[min_idx], arr[i]);
    }
}

// Example usage
int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    selectionSort(arr);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

## Advantages
1. Simple to implement and understand
2. Performs well on small datasets
3. In-place sorting algorithm (doesn't require extra space)
4. Makes the minimum number of swaps (O(n) swaps)
5. Works well when memory write is a costly operation

## Disadvantages
1. Inefficient for large datasets with O(n²) time complexity
2. Doesn't adapt to partially sorted arrays (always performs the same operations)
3. Not stable (can change the relative order of equal elements)
4. Consistently outperformed by insertion sort in most scenarios

## Applications
1. Used in scenarios where the cost of swapping elements is high
2. Educational purposes to teach sorting algorithms
3. Small datasets where the simplicity of the algorithm is valued
4. When memory usage is a concern