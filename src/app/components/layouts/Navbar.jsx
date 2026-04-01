"use client";
const Navbar = () => {
    const links = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Coverage', href: '/coverage' },
        { name: 'About Us', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Be a Rider', href: '/rider' },
    ];
    return (
        <div>
            <div className="navbar  ">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {links.map((link) => (
                                <li key={link.name}> 
                                  <a href={link.href}>{link.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-end">
                        <img className="mb-2 w-7" src="/assets/logo.png" alt="Logo" />
                        <h1 className="text-2xl font-semibold">Profast</h1>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {links.map((link) => (
                            <li key={link.name}>
                             <a href={link.href}>{link.name}</a> </li>
                        ))}
                    </ul>
                </div>
                <div className="navbar-end gap-4">
                    <a className="btn border-b-2 border-[#caeb66]">Sign In</a>
                    <a className="btn bg-[#caeb66] text-black">Be a Rider</a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;