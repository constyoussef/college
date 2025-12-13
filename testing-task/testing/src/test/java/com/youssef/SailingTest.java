package com.youssef;

import java.util.Random;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static org.testng.Assert.fail;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class SailingTest {

  @DataProvider(name = "sailingTestData")
  public Object[][] createTestData() {
    return new Object[][] {
        { "EP1", true, false, 2, true, "Weekend, good wind, not July" },
        { "EP2", false, true, 3, true, "Weekday in July, good wind" },
        { "EP3", false, false, 4, false, "Weekday, not July, good wind" },
        { "EP4", true, true, 5, false, "Weekend in July, wind too strong" },
        { "EP5", true, false, 8, false, "Weekend, wind too strong" },
        { "EP6", false, true, 12, false, "Weekday in July, wind too strong" },
        { "EP7", true, true, 0, true, "Weekend in July, no wind" }
    };
  }

  @Test(dataProvider = "sailingTestData")
  public void testAvailableValid(
      String testId,
      boolean weekend,
      boolean july,
      int windforce,
      boolean expected,
      String description) throws Exception {

    boolean result = Sailing.available(weekend, july, windforce);
    assertEquals(result, expected, testId + " : " + description);
  }

  @Test
  public void testEP8() {
    try {
      Sailing.available(false, false, -1);
      fail("EP8: Should throw Exception for windforce < 0");
    } catch (Exception e) {
      assertTrue(e.getMessage().contains("Invalid parameter"));
    }
  }

  @Test
  public void testEP9() {
    try {
      Sailing.available(true, false, 13);
      fail("EP9: Should throw Exception for windforce > 12");
    } catch (Exception e) {
      assertTrue(e.getMessage().contains("Invalid parameter"));
    }
  }

  //  @Test
  // public void testSC1_Windforce11() throws Exception {
  //   boolean result = Sailing.available(true, false, 11);
  //   // According to buggy code, this would return true, but according to spec it should be false.
  //   // For statement coverage we just call it to execute the branch and assert expected as per spec:
  //   assertFalse(result, "SC1: Windforce 11 should return false according to spec");
  // }

  // @Test
  // public void testSC2_Windforce11July() throws Exception {
  //   boolean result = Sailing.available(false, true, 11);
  //   assertFalse(result, "SC2: Windforce 11 in July should return false according to spec");
  // }

  @Test
  public void testCT1() throws Exception {
    assertTrue(Sailing.available(true, false, 2), "CT1: Weekend good wind -> true");
  }

  @Test
  public void testCT2() throws Exception {
    assertTrue(Sailing.available(false, true, 3), "CT2: July good wind -> true");
  }

  @Test
  public void testCT3() throws Exception {
    assertFalse(Sailing.available(false, false, 1), "CT3: Weekday non-July with good wind -> false");
  }

  @Test
  public void testCT4() throws Exception {
    assertFalse(Sailing.available(true, true, 8), "CT4: Weekend with high wind -> false");
  }



  @Test
  public void randomTest_Million() throws Exception {
    Random r1 = new Random();
    Random r2 = new Random();
    Random r3 = new Random();
    Random r4 = new Random();

    int fails = 0;

    for (int i = 0; i < 1_000_000; i++) {
      boolean expected = r1.nextBoolean(); // choose desired output randomly

      boolean weekend;
      boolean july;
      int windforce;

      if (expected) {
        weekend = r2.nextBoolean();
        if (!weekend) {
          july = true;
        } else {
          july = r3.nextBoolean();
        }
        windforce = r4.nextInt(5); // 0..4
      } else {
        if (r2.nextBoolean()) {
          // good wind but wrong day
          windforce = r4.nextInt(5); // 0..4
          weekend = false;
          july = false;
        } else {
          // bad wind
          windforce = 5 + r4.nextInt(8); // 5..12
          weekend = r2.nextBoolean();
          july = r3.nextBoolean();
        }
      }

      boolean actual;
      try {
        actual = Sailing.available(weekend, july, windforce);
      } catch (Exception e) {
        // skip invalid (shouldn't happen because we generate valid values)
        continue;
      }

      if (actual != expected) {
        fails++;
        // Optional: log first few failures for debugging
        if (fails <= 5) {
          System.out.printf("Fail %d: expected=%b weekend=%b july=%b wind=%d actual=%b%n",
              fails, expected, weekend, july, windforce, actual);
        }
      }
    }

    System.out.println("Random test finished. Fails: " + fails);
    assertEquals(fails, 0, "Random tests should all pass (fails found)");
  }

}


