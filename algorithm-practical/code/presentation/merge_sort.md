# Merge Sort

## Overview
Merge sort is an efficient, stable, divide-and-conquer sorting algorithm. It divides the input array into two halves, recursively sorts them, and then merges the sorted halves to produce the final sorted array.

## Time Complexity
- **Best Case**: O(n log n) - Consistent performance
- **Average Case**: O(n log n) - Logarithmic time complexity
- **Worst Case**: O(n log n) - Consistent even with worst inputs

## Space Complexity
- O(n) - Requires additional space for the temporary arrays during merging

## When to Use
- Large datasets
- When stable sorting is required
- When worst-case performance is important
- External sorting (sorting data that doesn't fit in memory)
- Linked lists (where merge sort can be implemented with O(1) extra space)

## C++ Implementation

```cpp
#include <iostream>
#include <vector>

void merge(std::vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temporary arrays
    std::vector<int> L(n1), R(n2);
    
    // Copy data to temporary arrays
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }
    
    // Merge the temporary arrays back into arr[left..right]
    int i = 0; // Initial index of first subarray
    int j = 0; // Initial index of second subarray
    int k = left; // Initial index of merged subarray
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy the remaining elements of L[], if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy the remaining elements of R[], if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSortHelper(std::vector<int>& arr, int left, int right) {
    if (left < right) {
        // Same as (left+right)/2, but avoids overflow for large left and right
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSortHelper(arr, left, mid);
        mergeSortHelper(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}

void mergeSort(std::vector<int>& arr) {
    mergeSortHelper(arr, 0, arr.size() - 1);
}

// Example usage
int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    mergeSort(arr);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

## Advantages
1. Efficient for large datasets with guaranteed O(n log n) performance
2. Stable sorting algorithm (preserves the relative order of equal elements)
3. Predictable performance regardless of input data
4. Parallelizable - suitable for multi-threaded implementations
5. Well-suited for external sorting (data that doesn't fit in memory)

## Disadvantages
1. Requires O(n) extra space for the merge step
2. Not an in-place sorting algorithm
3. Overkill for small arrays (insertion sort is often faster)
4. Has higher constant factors compared to quicksort

## Applications
1. Used in external sorting of large data files
2. Standard sorting algorithm in many programming language libraries
3. Used in counting inversions in an array
4. Used in databases for efficient sorting
5. Java's Arrays.sort() for objects uses merge sort
6. Used when stability is required (e.g., database sorting with multiple keys)