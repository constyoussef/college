# Quick Sort

## Overview
Quick sort is an efficient, divide-and-conquer sorting algorithm that works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.

## Time Complexity
- **Best Case**: O(n log n) - When the pivot divides the array in roughly equal halves
- **Average Case**: O(n log n) - Logarithmic time complexity on average
- **Worst Case**: O(n²) - When the pivot is consistently the smallest or largest element

## Space Complexity
- **Average Case**: O(log n) - Due to the recursion stack
- **Worst Case**: O(n) - In worst case scenario

## When to Use
- Large datasets
- When average-case performance matters more than worst-case
- When in-place sorting is required
- Internal sorting (where all data fits in memory)
- When additional memory usage is a concern

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Choose the rightmost element as pivot
    int i = (low - 1); // Index of smaller element
    
    for (int j = low; j <= high - 1; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            i++; // Increment index of smaller element
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSortHelper(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        // pi is partitioning index, arr[pi] is now at right place
        int pi = partition(arr, low, high);
        
        // Separately sort elements before partition and after partition
        quickSortHelper(arr, low, pi - 1);
        quickSortHelper(arr, pi + 1, high);
    }
}

void quickSort(std::vector<int>& arr) {
    quickSortHelper(arr, 0, arr.size() - 1);
}

// Example usage
int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    quickSort(arr);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

## Advantages
1. Generally faster in practice than other O(n log n) algorithms
2. In-place sorting (requires only a small auxiliary stack)
3. Cache-friendly - good locality of reference
4. Tail recursion can be optimized
5. Parallelizable version available for multi-threaded environments

## Disadvantages
1. Unstable sorting algorithm (doesn't preserve relative order of equal elements)
2. Worst-case time complexity is O(n²)
3. Performance depends heavily on pivot selection
4. Not adaptive (doesn't take advantage of partially sorted arrays)

## Pivot Selection Strategies
1. **First element**: Simple but performs poorly on sorted arrays
2. **Last element**: Used in the implementation above
3. **Random element**: Good average-case performance
4. **Median-of-three**: Choose median of first, middle, and last elements
5. **Median-of-medians**: Guarantees O(n log n) but rarely used in practice

## Applications
1. Standard sorting algorithm in many libraries (e.g., C++'s std::sort)
2. General-purpose sorting in operating systems and programming languages
3. Used when average case performance is more important than worst case
4. Used when memory usage is a concern
5. Often combined with insertion sort for small partitions (Introsort)