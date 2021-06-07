import { useCallback, useEffect, useMemo, useState } from 'react';

export enum Status {
  Enter = 'enter',
  Entering = 'entering',
  Entered = 'entered',
  Exit = 'exit',
  Exiting = 'exiting',
  Exited = 'exited',
}

type Timeout = number | { enter?: number; exit?: number };

const DEFAULT_TIMEOUT = 300;

const useStatusTransition = ({
  active,
  appear = false,
  timeout = DEFAULT_TIMEOUT,
}: {
  active: boolean;
  appear?: boolean;
  timeout?: Timeout;
}) => {
  const [status, setStatus] = useState<Status>(() => {
    return active && !appear ? Status.Entered : Status.Exited;
  });

  const macroSetStatus = useCallback((status: Status) => {
    macroCall(() => {
      setStatus(status);
    });
  }, []);



  const { enter, exit } = useMemo(() => getTimeouts(timeout), [timeout]);

  useEffect(() => {
    let timer: any
    if (active) {
      setStatus((status) => {
        if (status === Status.Entered) return status;

        timer = setTimeout(() => {
          setStatus(Status.Entered);
        }, enter);
        return Status.Enter;
      });
    } else {
      setStatus((status) => {
        if (status === Status.Exited) return status;
        timer = setTimeout(() => {
          setStatus(Status.Exited);
        }, exit);
        return Status.Exit;
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [active, enter, exit]);

  useEffect(() => {
    if (status === Status.Enter) {
      macroSetStatus(Status.Entering);
    } else if (status === Status.Exit) {
      macroSetStatus(Status.Exiting);
    }
  }, [macroSetStatus, status]);

  return status;
};

function macroCall(fn: () => void) {
  Promise.resolve().then(fn);
}

function getTimeouts(timeout: Timeout) {
  let enter: number, exit: number;

  if (typeof timeout === 'number') {
    exit = enter = timeout;
  } else {
    exit = timeout.exit || DEFAULT_TIMEOUT;
    enter = timeout.enter || DEFAULT_TIMEOUT;
  }

  return { exit, enter };
}

export default useStatusTransition;
