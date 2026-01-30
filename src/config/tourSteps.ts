// ... (previous content)
export const studentTourSteps = [
    {
        element: '#tour-student-welcome',
        popover: {
            title: 'مرحباً بك في إتقان',
            description: 'هذه لوحة التحكم الخاصة بك، حيث يمكنك متابعة تقدمك وجلساتك.',
            side: "bottom" as const,
            align: 'start' as const
        }
    },
    {
        element: '#tour-student-session',
        popover: {
            title: 'جلستك القادمة',
            description: 'هنا تظهر تفاصيل جلستك القادمة وزر الانضمام.',
            side: "bottom" as const,
            align: 'start' as const
        }
    },
    {
        element: '#tour-student-progress',
        popover: {
            title: 'تقدمك في الحفظ',
            description: 'تابعي تقدمك في حفظ القرآن الكريم، السورة والآية الحالية.',
            side: "top" as const,
            align: 'start' as const
        }
    },
    {
        element: '#tour-student-latest-record',
        popover: {
            title: 'آخر سجل متابعة',
            description: 'هنا تجدين تفاصيل آخر حصة وتقييم المعلمة وملاحظاتها.',
            side: "top" as const,
            align: 'start' as const
        }
    },
    {
        element: '.bottom-nav',
        popover: {
            title: 'التنقل السريع',
            description: 'استخدمي الشريط السفلي للتنقل بين الصفحات المختلفة بسهولة.',
            side: "top" as const,
            align: 'center' as const
        }
    }
];

export const teacherTourSteps = [
    {
        element: '#tour-teacher-welcome',
        popover: {
            title: 'مرحباً بك يا معلمة',
            description: 'هذه لوحة التحكم الخاصة بك لإدارة الطلاب والجلسات.',
            side: "bottom" as const,
            align: 'start' as const
        }
    },
    {
        element: '#tour-teacher-stats',
        popover: {
            title: 'إحصائيات سريعة',
            description: 'نظرة عامة على عدد الطلاب والجلسات والتقييم.',
            side: "bottom" as const,
            align: 'start' as const
        }
    },
    {
        element: '#tour-teacher-upcoming',
        popover: {
            title: 'الجلسات القادمة',
            description: 'قائمة بجلساتك القادمة لليوم، يمكنك الانضمام منها مباشرة.',
            side: "left" as const,
            align: 'start' as const
        }
    },
    {
        element: '#tour-teacher-actions',
        popover: {
            title: 'إجراءات سريعة',
            description: 'أزرار سريعة لإضافة طالب أو جدولة جلسة جديدة.',
            side: "top" as const,
            align: 'start' as const
        }
    },
    {
        element: '.bottom-nav',
        popover: {
            title: 'التنقل',
            description: 'تنقلي بين الطلاب، الجلسات، والواجبات من هنا.',
            side: "top" as const,
            align: 'center' as const
        }
    }
];
