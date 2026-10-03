export default function Section({
    id,
    children,
    className = "",
    containerClassName = "",
}: {
    id?: string;
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
}) {
    return (
        <section
            id={id}
            className={`scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32 ${className}`}
        >
            <div className={`mx-auto w-full max-w-7xl ${containerClassName}`}>
                {children}
            </div>
        </section>
    );
}