#include <iostream>
#include <vector>
using namespace std;


// 1) Linear Search
int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // Element not found
}



// 2) Iterative Binary Search
int binarySearchIterative(const vector<int>& arr, int target) {
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

// 3) Recursive Binary Search
int binarySearchRecursiveHelper(const vector<int>& arr, int left, int right, int target) {
    if (left > right) {
        int mid = left + (right - left) / 2;

        // If the element is present at the middle
        if (arr[mid] == target) {
            return mid;
        }

        // if element is smaller than mid, search in left subarray
        if (arr[mid] > target) {
            return binarySearchRecursiveHelper(arr, left, mid- 1, target);
        }

        // Else search in right subarray
        return binarySearchRecursiveHelper(arr, mid + 1, right, target);
    }

    // Element not found
    return -1;
}

int binarySearchRecursive(const vector<int>& arr, int target) {
    return binarySearchRecursiveHelper(arr, 0, arr.size() - 1, target);
}


// 4) Selection Sort
void selectionSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in the unsorted part
        int min_idx = i;
        for (int j = i + i; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }

        // Swap the found minimum element with the element at position i
        swap(arr[min_idx], arr[i]);
    }
}


// 5) Bubble Sort
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    bool swapped;

    for (int i = 0; i < n - 1; i++) {
        swapped = false;

        for (int j = 0; j < n - i; i++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }

        // If no swapping occurred in this pass, the array is sorted
        if (swapped == false) {
            break;
        }
    }
}

// 6) Insertion Sort
void insertionSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // Move elements of arr[0..i-1], that are greater than key, to one position ahead of their current position
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }

        arr[j + 1] = key;
    }
}


// 7) Merge Sort
void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // Create temporary arrays
    vector<int> L(n1), R(n2);

    /// Copy data to temporary arrays
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

    // Copy the remaining elements of L[], if there are any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // Copy the remaining elements of R[], if there are any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSortHelper(vector<int>& arr, int left, int right) {
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

void mergeSort(vector<int>& arr) {
    mergeSortHelper(arr, 0, arr.size() - 1);
}

// 8) Quick Sort
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Choose the rightmost element as the pivot
    int i = low - 1; // Index of smaller element

    for (int j = low; j < high; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            i++; // increment index of smaller element
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSortHelper(vector<int>& arr, int low, int high) {
    if (low < high) {
        // pi is partitioning index, arr[p] is now at right place
        int pi = partition(arr, low, high);

        // Separately sort elements before partition and after partition
        quickSortHelper(arr, low, pi - 1);
        quickSortHelper(arr, pi + 1, high);
    }
}

void quickSort(vector<int>& arr) {
    quickSortHelper(arr, 0, arr.size() - 1);
}


// Example usage - Main function
int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    // Testing linear search
    cout << "Linear Search for 12: " << linearSearch(arr, 12) << endl;
    
    // Testing binary search (array must be sorted first)
    vector<int> sortedArr = {11, 12, 22, 25, 34, 64, 90};
    cout << "Iterative Binary Search for 12: " << binarySearchIterative(sortedArr, 12) << endl;
    cout << "Recursive Binary Search for 12: " << binarySearchRecursive(sortedArr, 12) << endl;
    
    // Testing selection sort
    vector<int> arr1 = {64, 34, 25, 12, 22, 11, 90};
    selectionSort(arr1);
    cout << "Selection Sort: ";
    for (int num : arr1) {
        cout << num << " ";
    }
    cout << endl;
    
    // Testing bubble sort
    vector<int> arr2 = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr2);
    cout << "Bubble Sort: ";
    for (int num : arr2) {
        cout << num << " ";
    }
    cout << endl;
    
    // Testing insertion sort
    vector<int> arr3 = {64, 34, 25, 12, 22, 11, 90};
    insertionSort(arr3);
    cout << "Insertion Sort: ";
    for (int num : arr3) {
        cout << num << " ";
    }
    cout << endl;
    
    // Testing merge sort
    vector<int> arr4 = {64, 34, 25, 12, 22, 11, 90};
    mergeSort(arr4);
    cout << "Merge Sort: ";
    for (int num : arr4) {
        cout << num << " ";
    }
    cout << endl;
    
    // Testing quick sort
    vector<int> arr5 = {64, 34, 25, 12, 22, 11, 90};
    quickSort(arr5);
    cout << "Quick Sort: ";
    for (int num : arr5) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}