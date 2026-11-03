import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ChevronDown, ChevronRight, Dot } from 'lucide-react';

export interface BranchedMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
  children?: BranchedMenuItem[];
}

export interface BranchedMenuGroup {
  title: string;
  description?: string;
  icon?: LucideIcon;
  items: BranchedMenuItem[];
}

interface BranchedMenuProps {
  groups: BranchedMenuGroup[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const BranchedMenu: React.FC<BranchedMenuProps> = ({
  groups,
  activeId,
  onSelect,
}) => {
  // Keep track of which groups or parents are open (default open all or smart open)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach((g, idx) => {
      initial[g.title] = true;
    });
    return initial;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {groups.map((group, groupIdx) => {
        const isOpen = openGroups[group.title] !== false;
        const GroupIcon = group.icon;
        const containsActive = group.items.some(
          (item) => item.id === activeId || item.children?.some((c) => c.id === activeId)
        );

        return (
          <div key={groupIdx} className="relative">
            {/* Group Header / Trunk Trigger */}
            <button
              onClick={() => toggleGroup(group.title)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all duration-200 group cursor-pointer ${
                containsActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {GroupIcon && (
                  <GroupIcon
                    className={`w-4 h-4 transition-colors ${
                      containsActive ? 'text-[#F7A81B]' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                )}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block">
                    {group.title}
                  </span>
                  {group.description && (
                    <span className="text-[9px] text-slate-500 block leading-tight font-normal">
                      {group.description}
                    </span>
                  )}
                </div>
              </div>

              <span className="p-0.5 rounded text-slate-500 group-hover:text-slate-300">
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200" />
                )}
              </span>
            </button>

            {/* Tree Branch with Animated SVG Connection Lines */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative ml-4 pl-4 border-l border-white/10 mt-1 space-y-1"
                >
                  {group.items.map((item, itemIdx) => {
                    const isActive = activeId === item.id;
                    const ItemIcon = item.icon;

                    return (
                      <div key={item.id} className="relative group/item">
                        {/* Horizontal branch line from trunk */}
                        <div
                          className={`absolute -left-4 top-1/2 w-3.5 h-[1px] transition-colors duration-200 ${
                            isActive
                              ? 'bg-[#F7A81B] shadow-[0_0_8px_rgba(247,168,27,0.8)]'
                              : 'bg-white/10 group-hover/item:bg-white/25'
                          }`}
                        />

                        {/* Node marker indicator on the trunk */}
                        <div
                          className={`absolute -left-[19px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                            isActive
                              ? 'bg-[#F7A81B] ring-2 ring-[#F7A81B]/30 scale-125'
                              : 'bg-slate-700 group-hover/item:bg-slate-500'
                          }`}
                        />

                        {/* Item Button */}
                        <button
                          onClick={() => onSelect(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#F7A81B]/20 via-[#F7A81B]/10 to-transparent text-white border border-[#F7A81B]/30 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {ItemIcon && (
                              <ItemIcon
                                className={`w-3.5 h-3.5 ${
                                  isActive ? 'text-[#F7A81B]' : 'text-slate-400 group-hover/item:text-slate-200'
                                }`}
                              />
                            )}
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                                isActive
                                  ? 'bg-[#F7A81B]/30 text-[#F7A81B]'
                                  : 'bg-white/5 text-slate-400'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

