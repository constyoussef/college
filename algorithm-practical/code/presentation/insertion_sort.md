# Insertion Sort

## Overview
Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It works by taking elements from the unsorted part and inserting them at the correct position in the already sorted part.

## Time Complexity
- **Best Case**: O(n) - When the array is already sorted
- **Average Case**: O(n²) - Quadratic time complexity
- **Worst Case**: O(n²) - When the array is reverse sorted

## Space Complexity
- O(1) - In-place sorting algorithm that uses constant extra space

## When to Use
- Small datasets
- Nearly sorted arrays
- Online algorithm (can sort as data arrives)
- When simplicity is preferred
- As part of more complex hybrid sorting algorithms

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements of arr[0..i-1] that are greater than key
        // to one position ahead of their current position
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
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
    
    insertionSort(arr);
    
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
2. Efficient for small datasets
3. Adaptive - efficient for nearly sorted arrays
4. In-place algorithm (requires no additional storage)
5. Stable sorting algorithm (preserves the relative order of equal elements)
6. Online algorithm - can sort the array as it receives new elements

## Disadvantages
1. Inefficient for large datasets with O(n²) time complexity
2. Much less efficient than advanced algorithms like Quick Sort, Merge Sort, or Heap Sort
3. Requires shifting elements in the array which can be costly

## Applications
1. Used when the array is small or nearly sorted
2. Often used as part of more complex algorithms (like introsort)
3. Used in practice by many libraries for small arrays
4. Database scenarios where records arrive one at a time
5. Used in computer graphics algorithms (like polygon filling)
6. Used as the final step in non-comparison sorts like radix sort