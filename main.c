/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <stdio.h>
int main() {
    int i, sum = 0;
    int n1,n2;
    printf("Enter the 2nd Number : ");
    scanf("%d", &n1);
    printf("Enter the 2nd Number : ");
    scanf("%d", &n2);
    for (i = n1 ; i < n2; i++) {
        sum += i;
    }
    printf("Sum of Numbers is : %d", sum);
    return 0;
}
