import React from 'react';
import { Section, DeviceInfo } from '../types';
import { Icons } from './Icons';

const devices: DeviceInfo[] = [
  {
    name: "Redmi Note 12 5G",
    codename: "sunstone",
    chipset: "Snapdragon 4 Gen 1",
    status: "Stable",
    image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-5g-global.jpg"
  },
  {
    name: "Poco X5 5G",
    codename: "moonstone",
    chipset: "Snapdragon 695",
    status: "Stable",
    image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x5-5g.jpg"
  },
  {
    name: "Redmi Note 12",
    codename: "stone",
    chipset: "Snapdragon 685",
    status: "Beta",
    image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-4g.jpg"
  }
];

const Devices: React.FC = () => {
  return (
    <section id={Section.DEVICES} className="py-20 relative">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col items-center mb-16 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-mono mb-4">
             <Icons.Smartphone size={14} />
             <span>OFFICIAL MAINTAINER</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 dark:text-white">
             Device <span className="text-gradient">Portfolio</span>
           </h2>
           <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
             Primary development targets. Providing stable recoveries, custom ROM trees, and kernel enhancements.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {devices.map((device) => (
            <div key={device.codename} className="group glass-panel p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl dark:shadow-none">
              <div className="bg-white dark:bg-[#0a0a0f] rounded-xl overflow-hidden relative h-full flex flex-col transition-colors duration-300">
                
                {/* Image Placeholder area */}
                <div className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-black relative overflow-hidden flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-shadow">
                   <div className="absolute inset-0 opacity-30 bg-[url('https://picsum.photos/seed/tech/800/600')] bg-cover bg-center mix-blend-overlay dark:mix-blend-overlay"></div>
                   <Icons.Smartphone className="w-16 h-16 text-gray-400 dark:text-gray-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300" />
                   
                   <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        device.status === 'Stable' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30' : 
                        'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
                      }`}>
                        {device.status}
                      </span>
                   </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">{device.name}</h3>
                  <p className="text-cyan-600 dark:text-cyan-400 font-mono text-sm mb-4">codenamed: "{device.codename}"</p>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/5 pt-3">
                      <Icons.Cpu size={16} className="text-purple-600 dark:text-purple-400" />
                      <span>{device.chipset}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                       <a 
                         href={`https://github.com/himelpvz/android_device_xiaomi_${device.codename}`}
                         target="_blank"
                         rel="noreferrer"
                         className="flex-1 text-center bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg py-2 text-xs font-bold uppercase tracking-wide transition-colors text-gray-700 dark:text-gray-300"
                       >
                         Device Tree
                       </a>
                       <a 
                         href={`https://github.com/himelpvz/android_vendor_xiaomi_${device.codename}`}
                         target="_blank"
                         rel="noreferrer"
                         className="flex-1 text-center bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg py-2 text-xs font-bold uppercase tracking-wide transition-colors text-gray-700 dark:text-gray-300"
                       >
                         Vendor
                       </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Devices;