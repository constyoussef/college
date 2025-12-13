// package anmany;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
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

public class Graphicproject extends JFrame {

    public Graphicproject() {
        setLocation(60, 0);
        setSize(1000, 1000);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        DrawPanel panel = new DrawPanel();
        add(panel);

        setVisible(true);
    }

    public static void main(String[] args) {
        Graphicproject p = new Graphicproject();
    }
}

class DrawPanel extends JPanel {

    private int X = 50;

    public DrawPanel() {
        Timer timer = new Timer(1000 / 60, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                X += 10;
                repaint();
            }
        });
        timer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D p = (Graphics2D) g;

        drawRoundRectangle(p);
        drawRectangle(p);
        drawArc(p);
        drawPath(p);
        drawLine(p);
        drawingEllipse(p);
    }

    private void drawRectangle(Graphics2D p) {
        // Road
        p.setColor(Color.BLACK);

        Rectangle2D rect2 = new Rectangle2D.Double(0, 500, 1500, 175);
        p.fill(rect2);
        Rectangle2D rect11 = new Rectangle2D.Double(250, 445, 70, 70);
        p.fill(rect11);
        p.setColor(Color.WHITE);
        Rectangle2D rect3 = new Rectangle2D.Double(100 + X, 560, 150, 55);
        p.fill(rect3);
        Rectangle2D rect4 = new Rectangle2D.Double(300 + X, 560, 150, 55);
        p.fill(rect4);
        Rectangle2D rect5 = new Rectangle2D.Double(500 + X, 560, 150, 55);
        p.fill(rect5);
        Rectangle2D rect6 = new Rectangle2D.Double(700 + X, 560, 150, 55);
        p.fill(rect6);
        Rectangle2D rect7 = new Rectangle2D.Double(900 + X, 560, 150, 55);
        p.fill(rect7);
        Rectangle2D rect8 = new Rectangle2D.Double(1100 + X, 560, 150, 55);
        p.fill(rect8);
        Rectangle2D rect9 = new Rectangle2D.Double(1300 + X, 560, 150, 55);
        p.fill(rect9);
        Rectangle2D rect1 = new Rectangle2D.Double(-100 + X, 560, 150, 55);
        p.fill(rect1);
        Rectangle2D rect12 = new Rectangle2D.Double(-130 + X, 560, 150, 55);
        p.fill(rect12);
        Rectangle2D rect13 = new Rectangle2D.Double(-160 + X, 560, 150, 55);
        p.fill(rect13);
        Rectangle2D rect14 = new Rectangle2D.Double(-190 + X, 560, 150, 55);
        p.fill(rect14);
        Rectangle2D rect15 = new Rectangle2D.Double(-220 + X, 560, 150, 55);
        p.fill(rect15);
        Rectangle2D rect16 = new Rectangle2D.Double(-250 + X, 560, 150, 55);
        p.fill(rect16);
        Rectangle2D rect17 = new Rectangle2D.Double(-280 + X, 560, 150, 55);
        p.fill(rect17);
        Rectangle2D rect18 = new Rectangle2D.Double(-310 + X, 560, 150, 55);
        p.fill(rect18);
        Rectangle2D rect19 = new Rectangle2D.Double(-340 + X, 560, 150, 55);
        p.fill(rect19);
        Rectangle2D rect20 = new Rectangle2D.Double(-370 + X, 560, 150, 55);
        p.fill(rect20);
    }

    private void drawRoundRectangle(Graphics2D p) {
        Color C3 = new Color(120, 150, 250);
        p.setColor(C3);
        RoundRectangle2D rrect1 = new RoundRectangle2D.Double(0, 0, 1500, 1500, 0, 0);
        p.fill(rrect1);
    }

    private void drawArc(Graphics2D p) {
        Color C3 = new Color(100, 250, 50);
        p.setColor(C3);
        Arc2D a1 = new Arc2D.Double(0, 100, 400, 800, 0, 180, Arc2D.PIE);
        p.draw(a1);
        p.fill(a1);
        Arc2D a2 = new Arc2D.Double(350, 250, 200, 500, 0, 180, Arc2D.PIE);
        p.fill(a2);
        Arc2D a3 = new Arc2D.Double(500, 250, 500, 500, 0, 180, Arc2D.PIE);
        p.fill(a3);
        Arc2D a4 = new Arc2D.Double(970, 50, 800, 900, 0, 180, Arc2D.PIE);
        p.fill(a4);
        Arc2D a5 = new Arc2D.Double(850, 435, 90, 90, 0, 45, Arc2D.PIE);
        p.fill(a5);
    }

    private void drawPath(Graphics2D p) {
        p.setColor(Color.WHITE);
        Path2D L;
        L = new Path2D.Double();
        L.moveTo(600, 200);
        L.quadTo(500, 150, 600, 100);
        L.quadTo(625, 15, 700, 75);
        L.quadTo(750, 5, 800, 75);
        L.quadTo(850, 5, 900, 100);
        L.quadTo(1050, 150, 900, 200);
        L.lineTo(600, 200);
        p.fill(L);
        // Car
        Color Cc = new Color(50, 200, 250);
        p.setColor(Cc);
        Path2D C;
        C = new Path2D.Double();
        C.moveTo(300, 400);
        C.lineTo(500, 400);
        C.lineTo(600, 300);
        C.lineTo(850, 300);
        C.lineTo(950, 400);
        C.lineTo(1150, 400);
        C.quadTo(1200, 425, 1150, 450);
        C.quadTo(1200, 475, 1150, 500);
        C.lineTo(950, 500);
        C.quadTo(900, 550, 850, 500);
        C.lineTo(600, 500);
        C.quadTo(550, 550, 500, 500);
        C.lineTo(300, 500);
        C.quadTo(250, 450, 300, 400);
        p.draw(C);
        p.fill(C);
        p.setColor(Color.BLACK);
        Path2D H;
        H = new Path2D.Double();
        H.moveTo(605, 305);
        H.lineTo(515, 405);
        H.lineTo(705, 405);
        H.lineTo(705, 305);
        H.lineTo(605, 305);
        p.fill(H);
        Path2D G;
        G = new Path2D.Double();
        G.moveTo(745, 305);
        G.lineTo(745, 405);
        G.lineTo(935, 405);
        G.lineTo(845, 305);
        G.lineTo(745, 305);
        p.fill(G);
    }

    private void drawingEllipse(Graphics2D p) {

        p.setColor(Color.YELLOW);
        Ellipse2D sun = new Ellipse2D.Double(X, 50, 120, 120);
        p.fill(sun);
        p.setColor(Color.BLACK);
        Ellipse2D e2 = new Ellipse2D.Double(1125, 400, 50, 45);
        p.fill(e2);
        Ellipse2D e3 = new Ellipse2D.Double(1125, 450, 50, 45);
        p.fill(e3);
        Ellipse2D e4 = new Ellipse2D.Double(850, 435, 90, 90);
        p.fill(e4);
        Ellipse2D e5 = new Ellipse2D.Double(500, 435, 90, 90);
        p.fill(e5);

    }

    private void drawLine(Graphics2D p) {
        p.setColor(Color.YELLOW);
        p.setStroke(new BasicStroke(9));
        Line2D l1 = new Line2D.Double(X + 105, 170, X + 125, 215);
        p.draw(l1);
        Line2D l2 = new Line2D.Double(X + 135, 130, X + 195, 130);
        p.draw(l2);
        Line2D l3 = new Line2D.Double(X + 120, 70, X + 165, 20);
        p.draw(l3);
        Line2D l4 = new Line2D.Double(X + 5, 65, X - 40, 20);
        p.draw(l4);
        Line2D l5 = new Line2D.Double(X + 10, 160, X - 40, 195);
        p.draw(l5);
        Line2D l6 = new Line2D.Double(X - 10, 105, X - 70, 105);
        p.draw(l6);
        p.setStroke(new BasicStroke(1));
        p.setColor(Color.BLACK);
        Line2D l7 = new Line2D.Double(725, 305, 725, 505);
        p.draw(l7);

    }

}