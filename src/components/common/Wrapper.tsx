"use client";


const Wrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-infobg pt-[70px] ml-[17%]">
      <div className="p-4 pt-2 min-h-screen">{children}</div>
 
    </div>
  );
};

export default Wrapper;
