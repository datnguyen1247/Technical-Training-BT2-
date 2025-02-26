export default function SkeletonText({
  width = "100%",
  height = "28px",
  radius = "4px",
}) {
  return (
    <div
      style={{
        width: `${width}`,
        height: `${height}`,
        borderRadius: `${radius}`,
        backgroundColor: "#dcdfe3",
      }}
    ></div>
  );
}
