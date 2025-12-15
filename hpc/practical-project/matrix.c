#include <stdio.h>
#include <stdlib.h>
#include <omp.h>

#define N 500 // Matrix size (can be changed during discussion)

int main()
{
  int i, j, k;
  double start, end;

  // Dynamically allocate matrices A, B, and C
  int **A = (int **)malloc(N * sizeof(int *));
  int **B = (int **)malloc(N * sizeof(int *));
  int **C = (int **)malloc(N * sizeof(int *));

  for (i = 0; i < N; i++)
  {
    A[i] = (int *)malloc(N * sizeof(int));
    B[i] = (int *)malloc(N * sizeof(int));
    C[i] = (int *)malloc(N * sizeof(int));
  }

  // Initialize matrices A and B, and set C to zero
  for (i = 0; i < N; i++)
    for (j = 0; j < N; j++)
    {
      A[i][j] = 1;
      B[i][j] = 1;
      C[i][j] = 0;
    }

  /* ================= Sequential Matrix Multiplication ================= */
  start = omp_get_wtime();

  for (i = 0; i < N; i++)
    for (j = 0; j < N; j++)
      for (k = 0; k < N; k++)
        C[i][j] += A[i][k] * B[k][j];

  end = omp_get_wtime();
  printf("Sequential Execution Time: %f seconds\n", end - start);

  // Reset matrix C before parallel execution
  for (i = 0; i < N; i++)
    for (j = 0; j < N; j++)
      C[i][j] = 0;

  /* ================= Parallel Matrix Multiplication using OpenMP ================= */
  start = omp_get_wtime();

// Parallelize the outer loop using OpenMP
#pragma omp parallel for private(j, k) shared(A, B, C)
  for (i = 0; i < N; i++)
    for (j = 0; j < N; j++)
      for (k = 0; k < N; k++)
        C[i][j] += A[i][k] * B[k][j];

  end = omp_get_wtime();
  printf("Parallel Execution Time: %f seconds\n", end - start);

  return 0;
}
