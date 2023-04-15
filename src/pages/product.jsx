import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronRightIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
    FolderIcon,
    HomeIcon,
    XMarkIcon} from '@heroicons/react/24/outline';
import * as borsh from '@project-serum/borsh';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import React, { Fragment,useState } from 'react'

const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon, current: false },
];

const folders = [
    { id: 1, name: 'Under review', icon: FolderIcon },
    { id: 2, name: 'BLM', icon: FolderIcon },
    { id: 3, name: 'Other', icon: FolderIcon },
];

const environments = {
    open: 'text-indigo-400 bg-indigo-300/10 ring-indigo-400/30',
    closed: 'text-red-400 bg-red-300/10 ring-indigo-400/30',
    pending: 'text-gray-400 bg-gray-300/10 ring-indigo-400/30',
    confidential: 'text-purple-400 bg-purple-300/10 ring-indigo-400/30',
    public: 'text-green-400 bg-green-300/10 ring-indigo-400/30',
};

const deployments = [
    {
        id: 1,
        href: '#',
        officerName: 'Flenniken, Cole',
        departmentName: 'Austin Police Department',
        statusText: '3 March, 2022',
        location: 'El Paso, Texas',
        environment: 'open',
    },
    {
        id: 2,
        href: '#',
        officerName: 'Galindo, Nathan',
        departmentName: 'San Antonio Police Department',
        statusText: '4 March, 2022',
        location: 'Houston, Texas',
        environment: 'pending',
    },
    {
        id: 3,
        href: '#',
        officerName: `Pienta, Phillip`,
        departmentName: 'Dallas Police Department',
        statusText: '5 March, 2022',
        location: 'Waco, Texas',
        environment: 'public',
    },
    // More deployments...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const Product = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const TARGET_PROGRAM = new web3.PublicKey("2pynzHyeAWqEj7ze4i1EC7SaoCA8LvVZj9uSidUjhUEa");

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const formLayout = borsh.struct([
        borsh.u8('bump'),
        borsh.u8('authority'),
        borsh.i64('created_at'),
        borsh.str('id'),
        borsh.str('incident_date'),
        borsh.str('status'),
        borsh.str('location'),
        borsh.str('incident_description'),
        borsh.str('arrest_description'),
        borsh.str('relevant_info'),
        borsh.str('officer'),
        borsh.vec(borsh.str(), 'victims'),
        borsh.vec(borsh.str(), 'witnesses'),
        borsh.vec(borsh.str(), 'offenders'),
    ]);
    
    const sendForm = async (event) => {
        event.preventDefault();
        console.log("CREATING FORM");

        if (!publicKey || !connection) {
            throw 'Please connect your wallet';
        };

        let buffer = Buffer.alloc(1000);

        formLayout.encode({
            id: '123',
            incident_date: '123',
            status: '123',
            location: '123',
            incident_description: '123',
            arrest_description: '123',
            relevant_info: '123',
            officer: '123',
            victims: ['123'],
            witnesses: ['123'],
            offenders: ['123'],
        }, buffer);

        buffer = buffer.slice(0, formLayout.getSpan(buffer));

        const [pda] = await web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from('form'),
                Buffer.from("_"),
                Buffer.from(formLayout.id)
            ],
            TARGET_PROGRAM
        );

        const transaction = new web3.Transaction();
        const instruction = new web3.TransactionInstruction({
            programId: TARGET_PROGRAM,
            data: buffer,
            keys: [
                {
                    pubkey: TARGET_PROGRAM,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ]
        });

        transaction.add(instruction);

        try {
            const signature = await sendTransaction(transaction, connection);
            console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <div className='bg-gray-900 h-screen'>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                                        <div className="flex h-0 shrink-0 items-center"/>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current
                                                                            ? 'bg-gray-800 text-white'
                                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                    )}
                                                                >
                                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                    {item.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                <li>
                                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your folders</div>
                                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                        {folders.map((folder) => (
                                                            <li key={`${folder.name}-${folder.id}`}>
                                                                <button className='text-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                                                        <folder.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                    </span>
                                                                    <span className="truncate text-gray-400 group-hover:text-white">{folder.name}</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>

                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                        <div className="flex h-16 shrink-0 items-center"/>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your folders</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                        {folders.map((folder) => (
                                            <li key={`${folder.name}-${folder.id}`}>
                                                <button
                                                    className='text-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                                        <folder.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    </span>
                                                    <span className="truncate text-gray-400 group-hover:text-white">{folder.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="xl:pl-72">
                    {/* Sticky search header */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                        <button type="button" className="-m-2.5 p-2.5 text-white xl:hidden" onClick={() => setSidebarOpen(true)}>
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <form className="flex flex-1" action="#" method="GET">
                                <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        type="search"
                                        name="search"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    onClick={sendForm}
                                    className='rounded-md bg-[#9e80ff] m-2 w-1/6 text-sm font-semibold text-white shadow-sm hover:bg-[#b29cfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                >
                                    Create Form
                                </button>   
                            </form>
                        </div>
                    </div>

                    <main>
                        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                            <h1 className="text-base font-semibold leading-7 text-white">Police Records</h1>

                            {/* Sort dropdown */}
                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-x-1 text-sm font-medium leading-6 text-white">
                                    Sort by
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active ? 'bg-gray-50' : '',
                                                        'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                    )}
                                                >
                                                    Name
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active ? 'bg-gray-50' : '',
                                                        'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                    )}
                                                >
                                                    Date updated
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </header>

                        {/* Deployment list */}
                        <ul role="list" className="divide-y divide-white/5">
                            {deployments.map((deployment) => (
                                <li key={deployment.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                                    <div className="min-w-0 flex-auto">
                                        <div className="flex items-center gap-x-3">
                                            <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                                                <a href={deployment.href} className="flex gap-x-2">
                                                    <span className="truncate">{deployment.departmentName}</span>
                                                    <span className="text-gray-400">/</span>
                                                    <span className="whitespace-nowrap">{deployment.officerName}</span>
                                                    <span className="absolute inset-0" />
                                                </a>
                                            </h2>
                                        </div>
                                        <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                                            <p className="truncate">{deployment.location}</p>
                                            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                                                <circle cx={1} cy={1} r={1} />
                                            </svg>
                                            <p className="whitespace-nowrap">{deployment.statusText}</p>
                                        </div>
                                    </div>
                                    <div
                                        className={classNames(
                                            environments[deployment.environment],
                                            'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset'
                                        )}
                                    >
                                        {deployment.environment}
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                </li>
                            ))}
                        </ul>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Product;
