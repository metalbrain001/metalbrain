const Loader = () => {
  return (
    <div className="flex-center w-full">
      <img
        src="/assets/icons/loader.svg"
        alt="Loader"
        loading="lazy"
        width={50}
        height={50}
        className="inline-block animate-spin rounded-full border-2 boder-gray-500 border-opacity-25"
      />
    </div>
  );
};

export default Loader;
