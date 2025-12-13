// package any;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.geom.Arc2D;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;
import java.awt.geom.Path2D;
import java.awt.geom.Rectangle2D;
import java.awt.geom.RoundRectangle2D;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.Timer;

public class GraphicProject extends JFrame {

    public GraphicProject() {
        setTitle("Animated Graphics Scene");
        setLocation(60, 0);
        setSize(1000, 700);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        DrawPanel panel = new DrawPanel();
        add(panel);

        setVisible(true);
    }

    public static void main(String[] args) {
        new GraphicProject();
    }
}

class DrawPanel extends JPanel {

    private int sunPosition = 50;
    private int roadMarkingOffset = 0;
    private final int ANIMATION_SPEED = 2;
    private final int ROAD_SPEED = 5;

    // Colors
    private final Color SKY_COLOR = new Color(120, 150, 250);
    private final Color GRASS_COLOR = new Color(100, 250, 50);
    private final Color CAR_COLOR = new Color(50, 200, 250);

    public DrawPanel() {
        Timer timer = new Timer(1000 / 60, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                updateAnimation();
                repaint();
            }
        });
        timer.start();
    }

    private void updateAnimation() {
        // Update sun position (slower movement)
        sunPosition += ANIMATION_SPEED;
        if (sunPosition > getWidth() + 150) {
            sunPosition = -150;
        }

        // Update road markings position
        roadMarkingOffset += ROAD_SPEED;
        if (roadMarkingOffset > 200) {
            roadMarkingOffset = 0;
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        // Enable anti-aliasing for smoother graphics
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);

        drawSky(g2d);
        drawHills(g2d);
        drawClouds(g2d);
        drawSun(g2d);
        drawRoad(g2d);
        drawCar(g2d);
    }

    private void drawSky(Graphics2D g2d) {
        g2d.setColor(SKY_COLOR);
        RoundRectangle2D sky = new RoundRectangle2D.Double(0, 0, getWidth(), getHeight(), 0, 0);
        g2d.fill(sky);
    }

    private void drawHills(Graphics2D g2d) {
        g2d.setColor(GRASS_COLOR);
        // Draw various hills using arcs
        Arc2D hill1 = new Arc2D.Double(0, 100, 400, 800, 0, 180, Arc2D.PIE);
        g2d.fill(hill1);

        Arc2D hill2 = new Arc2D.Double(350, 250, 200, 500, 0, 180, Arc2D.PIE);
        g2d.fill(hill2);

        Arc2D hill3 = new Arc2D.Double(500, 250, 500, 500, 0, 180, Arc2D.PIE);
        g2d.fill(hill3);

        Arc2D hill4 = new Arc2D.Double(970, 50, 800, 900, 0, 180, Arc2D.PIE);
        g2d.fill(hill4);
    }

    private void drawClouds(Graphics2D g2d) {
        g2d.setColor(Color.WHITE);
        Path2D cloud = new Path2D.Double();
        cloud.moveTo(600, 200);
        cloud.quadTo(500, 150, 600, 100);
        cloud.quadTo(625, 15, 700, 75);
        cloud.quadTo(750, 5, 800, 75);
        cloud.quadTo(850, 5, 900, 100);
        cloud.quadTo(1050, 150, 900, 200);
        cloud.lineTo(600, 200);
        g2d.fill(cloud);
    }

    private void drawSun(Graphics2D g2d) {
        // Draw sun
        g2d.setColor(Color.YELLOW);
        Ellipse2D sun = new Ellipse2D.Double(sunPosition, 50, 120, 120);
        g2d.fill(sun);

        // Draw sun rays
        g2d.setStroke(new BasicStroke(9, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));

        // Bottom right ray
        Line2D ray1 = new Line2D.Double(sunPosition + 105, 170, sunPosition + 125, 215);
        g2d.draw(ray1);

        // Right ray
        Line2D ray2 = new Line2D.Double(sunPosition + 135, 130, sunPosition + 195, 130);
        g2d.draw(ray2);

        // Top right ray
        Line2D ray3 = new Line2D.Double(sunPosition + 120, 70, sunPosition + 165, 20);
        g2d.draw(ray3);

        // Top left ray
        Line2D ray4 = new Line2D.Double(sunPosition + 5, 65, sunPosition - 40, 20);
        g2d.draw(ray4);

        // Bottom left ray
        Line2D ray5 = new Line2D.Double(sunPosition + 10, 160, sunPosition - 40, 195);
        g2d.draw(ray5);

        // Left ray
        Line2D ray6 = new Line2D.Double(sunPosition - 10, 105, sunPosition - 70, 105);
        g2d.draw(ray6);

        // Reset stroke
        g2d.setStroke(new BasicStroke(1));
    }

    private void drawRoad(Graphics2D g2d) {
        // Draw road
        g2d.setColor(Color.BLACK);
        Rectangle2D road = new Rectangle2D.Double(0, 500, getWidth(), 175);
        g2d.fill(road);

        // Traffic light pole
        Rectangle2D trafficLightPole = new Rectangle2D.Double(250, 445, 70, 70);
        g2d.fill(trafficLightPole);

        // Draw road markings - more efficient way to draw repeated markings
        g2d.setColor(Color.WHITE);
        int markingWidth = 150;
        int markingHeight = 55;
        int markingY = 560;

        // Draw markings across the road with animation
        for (int x = -400 + roadMarkingOffset; x < getWidth() + 400; x += 200) {
            Rectangle2D marking = new Rectangle2D.Double(x, markingY, markingWidth, markingHeight);
            g2d.fill(marking);
        }
    }

    private void drawCar(Graphics2D g2d) {
        // Draw car body
        g2d.setColor(CAR_COLOR);
        Path2D carBody = new Path2D.Double();
        carBody.moveTo(300, 400);
        carBody.lineTo(500, 400);
        carBody.lineTo(600, 300);
        carBody.lineTo(850, 300);
        carBody.lineTo(950, 400);
        carBody.lineTo(1150, 400);
        carBody.quadTo(1200, 425, 1150, 450);
        carBody.quadTo(1200, 475, 1150, 500);
        carBody.lineTo(950, 500);
        carBody.quadTo(900, 550, 850, 500);
        carBody.lineTo(600, 500);
        carBody.quadTo(550, 550, 500, 500);
        carBody.lineTo(300, 500);
        carBody.quadTo(250, 450, 300, 400);
        g2d.fill(carBody);

        // Draw car windows
        g2d.setColor(Color.BLACK);
        // Left window
        Path2D leftWindow = new Path2D.Double();
        leftWindow.moveTo(605, 305);
        leftWindow.lineTo(515, 405);
        leftWindow.lineTo(705, 405);
        leftWindow.lineTo(705, 305);
        leftWindow.lineTo(605, 305);
        g2d.fill(leftWindow);

        // Right window
        Path2D rightWindow = new Path2D.Double();
        rightWindow.moveTo(745, 305);
        rightWindow.lineTo(745, 405);
        rightWindow.lineTo(935, 405);
        rightWindow.lineTo(845, 305);
        rightWindow.lineTo(745, 305);
        g2d.fill(rightWindow);

        // Draw window divider line
        Line2D divider = new Line2D.Double(725, 305, 725, 505);
        g2d.draw(divider);

        // Draw wheels
        // Back wheel
        Ellipse2D backWheel = new Ellipse2D.Double(500, 435, 90, 90);
        g2d.fill(backWheel);

        // Front wheel
        Ellipse2D frontWheel = new Ellipse2D.Double(850, 435, 90, 90);
        g2d.fill(frontWheel);

    }
}