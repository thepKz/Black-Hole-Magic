"use client";
import React from "react";
import { motion } from "motion/react";

export type TestimonialItem = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className} style={{ width: 280, flexShrink: 0 }}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 16 }}
      >
        {[0, 1].map((setIndex) => (
          <React.Fragment key={setIndex}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={`${setIndex}-${i}`}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  padding: "20px 20px",
                  width: 280,
                  flexShrink: 0,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                {/* brand glow top-left */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 80,
                    height: 80,
                    pointerEvents: "none",
                    background: "radial-gradient(circle at 0% 0%, rgba(125,249,255,0.18), transparent 70%)",
                    borderTopLeftRadius: 16,
                  }}
                />

                {/* quote mark */}
                <div style={{ fontSize: 28, lineHeight: 1, color: "rgba(125,249,255,0.3)", marginBottom: 8, fontFamily: "Georgia, serif" }}>
                  &ldquo;
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.70)", margin: 0 }}>
                  {text}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                  <img
                    src={image}
                    alt={name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "1.5px solid rgba(255,255,255,0.15)",
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {name}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
