
import React, { createContext, useContext, useRef } from 'react';
import { driver, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { studentTourSteps, teacherTourSteps } from '../config/tourSteps';

interface TourContextType {
    startTour: (role: 'student' | 'teacher', force?: boolean) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const driverObj = useRef<Driver | null>(null);

    const startTour = (role: 'student' | 'teacher', force = false) => {
        const tourKey = `itqan_tour_seen_${role}`;

        // Check if already seen
        if (!force && localStorage.getItem(tourKey)) {
            return;
        }

        const steps = role === 'student' ? studentTourSteps : teacherTourSteps;

        // Initialize driver
        driverObj.current = driver({
            showProgress: true,
            animate: true,
            steps: steps,
            nextBtnText: 'التالي',
            prevBtnText: 'السابق',
            doneBtnText: 'إنهاء',
            onDestroyed: () => {
                // Mark as seen when finished or skipped
                localStorage.setItem(tourKey, 'true');
            }
        });

        driverObj.current.drive();
    };

    return (
        <TourContext.Provider value={{ startTour }}>
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
};
