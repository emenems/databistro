'use client';

import { Card, Tracker } from '@tremor/react';
import { RiErrorWarningFill } from "@remixicon/react";
import { trackerData, trackerDataInverse, trackerDataAvailability} from './data';

export function AvailabilityPlot() {
  return (
    <Card
      className="p-4"
      decoration={"top"}
      decorationColor={"emerald"}
    >
      <div>
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {trackerDataAvailability}%
        </p>
        <dt className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          {"Availability"}
        </dt>
      </div>
      <Tracker data={trackerData} className="mt-0 max-h-4" />
    </Card>
  );
}

export function UnavailabilityPlot() {
  return (
    <Card
      className="p-4"
      decoration={"top"}
      decorationColor={"red"}
    >
      <div>
        <div className="flex items-center space-x-2">
          <RiErrorWarningFill className="text-red-500" />
          <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {100 - trackerDataAvailability}%
          </p>
        </div>
        <dt className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          {"Unavailability"}
        </dt>
      </div>
      <Tracker data={trackerDataInverse} className="mt-0 max-h-4" />
    </Card>
  );
}