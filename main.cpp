/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <iostream>
using namespace std;
int main() {
    int sum = 0;
    int n1,n2 ;
    cout << "Enter the 1st number: ";
    cin >> n1;
    cout << "Enter the 2nd number: ";
    cin >> n2;
    for (int i = n1 ; i < n2; i++) {
        sum += i;
    }
    cout << "Sum of Numbers is :" << sum;
    return 0;
}