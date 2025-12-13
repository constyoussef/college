package com.youssef;

public class Sailing {

  /**
   * @param weekend - true if a weekend
   * @param july - true if in the month of july
   * @param windforce - on the standard scale (0-12)
   * @return true if sailing today (windforce <5, weekend,
   * or any day in july) otherwise false
   * @throws Exception any invalid inputs
   */
  public static boolean available(boolean weekend, boolean july, int windforce) throws Exception {
    boolean result = false;
    // Check parameters
    if ((windforce < 0) || (windforce > 12)) // line 16
      throw new Exception("Invalid parameter: windForce");
    // Evaluate
    if (weekend || july)
      if (windforce < 5)
        result = true;
      // else if (windforce == 11) // line 22
        // result = true; // line 23
    // Return the result
    return result; // line 25
  }
}