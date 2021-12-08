/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
import java.util.Scanner;
public class Main {
   public static void main(String args[]){
      int sum = 0;
      Scanner sc = new Scanner(System.in);
      System.out.print("Enter the 1st  number : ");
      int n1 = sc.nextInt();
      System.out.print("Enter the 2nd  number : ");
      int n2 = sc.nextInt();
      for (int i = n1 ; i<n2; i++){
         sum += i;
      }
      System.out.println("Sum of numbers : "+sum);
   }
}