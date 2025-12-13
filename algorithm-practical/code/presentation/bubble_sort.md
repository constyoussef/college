# Bubble Sort

## Overview
Bubble sort is one of the simplest sorting algorithms that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

## Time Complexity
- **Best Case**: O(n) - When the array is already sorted (with optimization)
- **Average Case**: O(n²) - Quadratic time complexity
- **Worst Case**: O(n²) - When the array is reverse sorted

## Space Complexity
- O(1) - In-place sorting algorithm that uses constant extra space

## When to Use
- Educational purposes
- Small datasets
- When the array is nearly sorted
- When simplicity is more important than efficiency
- When detecting if a list is already sorted (with optimization)

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        // If no swapping occurred in this pass, the array is sorted
        if (swapped == false) {
            break;
        }
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
    
    bubbleSort(arr);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

## Advantages
1. Simple to understand and implement
2. Adaptive - can be optimized to stop early if the list becomes sorted
3. In-place algorithm (requires no additional storage)
4. Stable sorting algorithm (preserves the relative order of equal elements)
5. Performs well on nearly sorted arrays with optimization

## Disadvantages
1. Very inefficient for large datasets with O(n²) time complexity
2. Performs a large number of comparisons and swaps
3. Generally performs worse than insertion sort
4. Not suitable for large datasets in practice

## Applications
1. Educational purposes - often taught as an introductory sorting algorithm
2. Checking if a small list is sorted or almost sorted
3. When simplicity of implementation is prioritized over efficiency
4. In embedded systems with limited memory where simplicity is important