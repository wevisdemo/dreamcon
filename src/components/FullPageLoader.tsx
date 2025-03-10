const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray1/30 z-50">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default FullPageLoader;
