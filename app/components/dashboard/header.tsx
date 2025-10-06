export default function Header() {

    return(
        <div className="w-full lg:h-14 h-32">
            <div className="block md:hidden flex w-full items-center justify-center">
                <a href="/" className="">
                    <span className="sr-only">BierBox</span>
                    <img 
                    alt=""
                    src="/Logo.png"
                    className="sm:size-24 size-auto"
                    />
                </a>
            </div>
        </div>
    );
}