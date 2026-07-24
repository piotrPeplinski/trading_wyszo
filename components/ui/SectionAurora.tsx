type SectionAuroraProps = {
  variant?: "left" | "right";
};

export function SectionAurora({ variant = "left" }: SectionAuroraProps) {
  const isLeft = variant === "left";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className={
          isLeft
            ? "aurora-blob left-[-12%] top-[-10%] h-[360px] w-[360px] bg-green/10"
            : "aurora-blob right-[-12%] top-[-10%] h-[360px] w-[360px] bg-green/10"
        }
        style={{ animationDelay: "2s" }}
      />
      <div
        className={
          isLeft
            ? "aurora-blob right-[-10%] bottom-[-15%] h-[320px] w-[320px] bg-gold/10"
            : "aurora-blob left-[-10%] bottom-[-15%] h-[320px] w-[320px] bg-gold/10"
        }
        style={{ animationDelay: "5s" }}
      />
    </div>
  );
}
