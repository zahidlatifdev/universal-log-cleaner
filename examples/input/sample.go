// Sample Go file with logs
package main

import "fmt"

func main() {
    fmt.Println("Starting application")
    
    result := calculate(10, 20)
    fmt.Printf("Result: %d\n", result)
    
    // @keep - Preserve this log
    fmt.Println("Important message")
    
    fmt.Println("This should be removed")
}

func calculate(a, b int) int {
    fmt.Println("Calculating", a, "+", b)
    return a + b
}

// Commented log
// fmt.Println("Commented")

