'''

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

'''
n1 = int(input("Enter the First Number: "))
n2 = int(input("Enter the Second Number: "))
sum = 0
for i in range(n1, n2):
    sum = sum + i 
print("Sum of Numbers is : ",sum)