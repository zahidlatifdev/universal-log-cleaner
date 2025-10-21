// Sample Java file with logs
public class Sample {
    public static void main(String[] args) {
        System.out.println("Starting application");
        
        int result = calculate(10, 20);
        System.out.println("Result: " + result);
        
        // @preserve - Keep this log
        System.out.println("Important message");
        
        System.err.println("Error message to remove");
    }
    
    private static int calculate(int a, int b) {
        System.out.println("Calculating " + a + " + " + b);
        return a + b;
    }
    
    // Commented log
    // System.out.println("Commented");
}

