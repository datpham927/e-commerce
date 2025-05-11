import { Skeleton } from '@mui/material';
import React from 'react';
import { SkeletonProducts } from '..';
import { useActionStore } from '../../store/actionStore';

const SkeLetonDetailPage: React.FC = () => {
    const { mobile_ui } = useActionStore();
    return (
        <>
            <div className="m-4">
                <Skeleton variant="rectangular" width={mobile_ui ? '100%' : '444px'} height={'30px'} />
            </div>
            <div className="flex tablet:flex-col">
                <div className="flex flex-col  rounded-l-md overflow-hidden p-4 gap-4 ">
                    <Skeleton variant="rectangular" width={mobile_ui ? '100%' : '444px'} height={mobile_ui ? '300px' : '444px'} />
                    <Skeleton variant="rectangular" width={mobile_ui ? '100%' : '444px'} height={'70px'} />
                </div>
                <div className="flex flex-col flex-1 h-full p-4 gap-6">
                    <Skeleton variant="rectangular" width={'100px'} height={'30px'} />
                    <Skeleton variant="rectangular" width={'100%'} height={'60px'} />
                    <Skeleton variant="rectangular" width={'50%'} height={'30px'} />
                    <Skeleton variant="rectangular" width={'50%'} height={'40px'} />
                    <div className="flex gap-4 ">
                        <Skeleton variant="rectangular" width={'200px'} height={'40px'} />
                        <Skeleton variant="rectangular" width={'150px'} height={'40px'} />
                    </div>
                    <Skeleton variant="rectangular" width={'40px'} height={'20px'} />
                </div>
            </div>

            <div className="flex flex-col p-3 rounded-sm bg-white gap-7 mt-5">
                <div className="text-2xl  px-6">
                    <Skeleton variant="rectangular" width={'200px'} height={'40px'} />
                </div>
                <SkeletonProducts index={6} />
            </div>
        </>
    );
};

export default SkeLetonDetailPage;
