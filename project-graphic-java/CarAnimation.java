import java.awt.BasicStroke;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GradientPaint;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RadialGradientPaint;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.geom.GeneralPath;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.Timer;

public class CarAnimation extends JPanel {
    private double backgroundX = 0; // Background position for scrolling
    private double bladeAngle = 0; // Wind turbine blade rotation angle
    private boolean isRunning = false;
    private Timer timer;

    public CarAnimation() {
        // Set up animation timer
        timer = new Timer(1000 / 60, e -> {
            updateAnimation();
            repaint();
        });
    }

    private void updateAnimation() {
        if (isRunning) {
            backgroundX -= 10;
            if (backgroundX <= -800)
                backgroundX = 0; // Reset background position

            bladeAngle += 2;
            if (bladeAngle >= 360)
                bladeAngle = 0;
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Draw sky with gradient
        GradientPaint skyGradient = new GradientPaint(0, 0, new Color(70, 130, 180), 0, getHeight(),
                new Color(135, 206, 250));
        g2d.setPaint(skyGradient);
        g2d.fillRect(0, 0, getWidth(), getHeight());

        // Save the current transform for background scrolling
        AffineTransform originalTransform = g2d.getTransform();
        g2d.translate(backgroundX, 0);

        // Draw hills with more detail
        drawHills(g2d);

        // Draw sun with rays
        drawSun(g2d, 700, 20);

        // Draw wind turbines
        drawWindTurbine(g2d, 100, 150);
        drawWindTurbine(g2d, 250, 150);
        drawWindTurbine(g2d, 400, 150);
        drawWindTurbine(g2d, 900, 150);
        drawWindTurbine(g2d, 1050, 150);
        drawWindTurbine(g2d, 1200, 150);

        // Restore transform after drawing background elements
        g2d.setTransform(originalTransform);

        // Draw curved path
        drawPath(g2d);

        // Draw road
        g2d.setColor(new Color(105, 105, 105));
        g2d.fillRect(0, 300, getWidth(), 100);

        // Draw road lines (scroll with background)
        g2d.setColor(Color.WHITE);
        for (int i = 0; i < 16; i++) {
            int lineX = (i * 100 + 50) + (int) backgroundX;
            if (lineX >= -100 && lineX <= getWidth()) {
                g2d.fillRect(lineX, 340, 50, 10);
            }
        }

        // Draw car in a fixed position
        drawCar(g2d, 200, 310);
    }

    private void drawHills(Graphics2D g2d) {
        g2d.setColor(new Color(34, 139, 34));
        g2d.fillArc(0, 150, 400, 200, 0, 180);
        g2d.fillArc(800, 150, 400, 200, 0, 180);

        g2d.setColor(new Color(50, 205, 50));
        g2d.fillArc(300, 100, 500, 300, 0, 180);
        g2d.fillArc(1100, 100, 500, 300, 0, 180);
    }

    private void drawSun(Graphics2D g2d, int x, int y) {
        RadialGradientPaint sunGradient = new RadialGradientPaint(x + 40, y + 40, 40, new float[] { 0f, 1f },
                new Color[] { Color.YELLOW, Color.ORANGE });
        g2d.setPaint(sunGradient);
        g2d.fillOval(x, y, 80, 80);

        g2d.setColor(Color.YELLOW);
        for (int i = 0; i < 12; i++) {
            g2d.rotate(Math.toRadians(30), x + 40, y + 40);
            g2d.fillRect(x + 40, y - 10, 5, 20);
        }
    }

    private void drawWindTurbine(Graphics2D g2d, int x, int y) {
        // Draw pole with gradient
        GradientPaint poleGradient = new GradientPaint(x, y, Color.LIGHT_GRAY, x + 20, y, Color.DARK_GRAY);
        g2d.setPaint(poleGradient);
        g2d.fillRect(x, y, 20, 100);

        // Draw nacelle
        g2d.setColor(Color.GRAY);
        g2d.fillRoundRect(x - 10, y - 50, 40, 20, 5, 5);

        // Save transform for blade rotation
        AffineTransform originalTransform = g2d.getTransform();
        g2d.translate(x + 10, y - 50);
        g2d.rotate(Math.toRadians(bladeAngle));

        // Draw realistic blades
        g2d.setColor(new Color(30, 144, 255));
        for (int i = 0; i < 3; i++) {
            GeneralPath blade = new GeneralPath();
            blade.moveTo(-5, -60);
            blade.quadTo(-10, -30, -5, 0);
            blade.lineTo(5, 0);
            blade.quadTo(10, -30, 5, -60);
            blade.closePath();
            g2d.fill(blade);
            g2d.rotate(Math.toRadians(120));
        }

        // Restore transform
        g2d.setTransform(originalTransform);
    }

    private void drawPath(Graphics2D g2d) {
        GeneralPath path = new GeneralPath();
        path.moveTo(0, 350);
        path.curveTo(200, 300, 400, 350, 800, 300);
        g2d.setColor(new Color(139, 69, 19)); // Brown for path
        g2d.setStroke(new BasicStroke(10));
        g2d.draw(path);
    }

    private void drawCar(Graphics2D g2d, int x, int y) {
        GradientPaint carGradient = new GradientPaint(x, y, new Color(220, 20, 60), x + 120, y, new Color(178, 34, 34));
        g2d.setPaint(carGradient);
        g2d.fillRoundRect(x, y - 40, 120, 40, 10, 10);

        g2d.setColor(new Color(178, 34, 34));
        g2d.fillRoundRect(x + 60, y - 60, 60, 20, 5, 5);

        g2d.setColor(Color.BLACK);
        g2d.fillRect(x + 65, y - 55, 20, 10);
        g2d.fillRect(x + 90, y - 55, 20, 10);

        g2d.setColor(Color.DARK_GRAY);
        g2d.fillOval(x + 20, y - 10, 20, 20);
        g2d.fillOval(x + 80, y - 10, 20, 20);

        g2d.setColor(Color.LIGHT_GRAY);
        g2d.fillOval(x + 25, y - 5, 10, 10);
        g2d.fillOval(x + 85, y - 5, 10, 10);

        g2d.setColor(Color.YELLOW);
        g2d.fillRect(x + 110, y - 30, 10, 5);
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Car Animation");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 450); // Increased height for control panel
        frame.setLayout(new BorderLayout());

        CarAnimation animation = new CarAnimation();
        frame.add(animation, BorderLayout.CENTER);

        // Set up control panel
        JPanel controlPanel = new JPanel();
        JButton startButton = new JButton("Start");
        JButton pauseButton = new JButton("Pause");
        JButton stopButton = new JButton("Stop");

        startButton.addActionListener(e -> {
            if (!animation.isRunning) {
                animation.isRunning = true;
                animation.timer.start();
            }
        });
        pauseButton.addActionListener(e -> {
            if (animation.isRunning) {
                animation.timer.stop();
                animation.isRunning = false;
            }
        });
        stopButton.addActionListener(e -> {
            if (animation.isRunning) {
                animation.timer.stop();
                animation.isRunning = false;
                animation.backgroundX = 0; // Reset background
                animation.bladeAngle = 0; // Reset blade angle
                animation.repaint();
            }
        });

        controlPanel.add(startButton);
        controlPanel.add(pauseButton);
        controlPanel.add(stopButton);
        frame.add(controlPanel, BorderLayout.SOUTH);

        frame.setVisible(true);
    }
}