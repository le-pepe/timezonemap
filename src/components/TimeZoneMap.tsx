import {memo, useEffect, useRef} from "react";
import * as d3 from "d3";

import tzList from "@/tzList.json";
import mapToDropdownMap from "./citiesToTimeZoneMap";

import "@/index.css";
import {MinusIcon, PlusIcon, RotateCcwIcon} from "lucide-react";
import {Button} from "@components/ui/button.tsx";

const scale = .65;
const width = 620;
const height = 450;

interface MapProps {
    selectedTimezone: { city: string; timezone: string } | null;
    setSelectedTimezone: (timezone: { city: string; timezone: string } | null) => void;
}

interface TimezoneData {
    id: string;
    [key: string]: unknown;
}

const Map = ({ selectedTimezone, setSelectedTimezone }: MapProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const zoomRef = useRef<any>(null);
    const initializedRef = useRef(false);

    const handleZoomIn = () => {
        if (svgRef.current && zoomRef.current) {
            const svg = d3.select(svgRef.current);
            svg.transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
        }
    };

    const handleZoomOut = () => {
        if (svgRef.current && zoomRef.current) {
            const svg = d3.select(svgRef.current);
            svg.transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
        }
    };

    const handleResetZoom = () => {
        if (svgRef.current && zoomRef.current) {
            const svg = d3.select(svgRef.current);
            svg.transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
        }
    };

    // Inicialización del mapa (solo una vez)
    useEffect(() => {
        if (svgRef.current && gRef.current && !initializedRef.current) {
            initializedRef.current = true;

            const path = d3.geoPath();

            const svg = d3
                .select(svgRef.current)
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserveAspectRatio", "xMidYMid meet");

            const g = d3.select(gRef.current);

            // Configure zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([1, 8])
                .wheelDelta((event) => -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002))
                .on("zoom", (event) => {
                    g.attr("transform", event.transform);
                });

            zoomRef.current = zoom;
            svg.call(zoom as any);

            // Draw the timezones (solo una vez)
            g
                .insert("g", ".graticule")
                .attr("class", "timezone-group")
                .attr("style", "cursor:pointer;")
                .selectAll("path")
                .data(tzList as TimezoneData[])
                .enter()
                .append("path")
                .attr("d", path as any)
                .attr("data-timezone-id", (d) => d.id)
                .on("click", (_e, d) => {
                    const timezone = mapToDropdownMap[d.id as keyof typeof mapToDropdownMap];
                    setSelectedTimezone({
                        city: d.id,
                        timezone: timezone || ""
                    });
                })
                .attr("class", "geography")
                .attr("opacity", 1)
                .attr("fill", "#AAAAAA")
                .attr("stroke-width", 0.5)
                .attr("stroke", "#FFFFFF")
                .attr("transform", `scale(${scale})`)
                .append("title")
                .text((d) => d.id);
        }
    }, [setSelectedTimezone]);

    // Actualizar colores cuando cambia la selección
    useEffect(() => {
        if (gRef.current && initializedRef.current) {
            const g = d3.select(gRef.current);

            g.selectAll<SVGPathElement, TimezoneData>("path")
                .attr("fill", (d) => {
                    if (selectedTimezone?.city === d.id) {
                        return "#000000";
                    }
                    return "#AAAAAA";
                });
        }
    }, [selectedTimezone]);

    return (
        <>
            <div data-tip="">
                <div style={{ width: "100%", position: "relative" }}>
                    {/* Zoom Controls */}
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomIn}
                            title="Zoom In"
                        >
                            <PlusIcon />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomOut}
                            title="Zoom Out"
                        >
                            <MinusIcon />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleResetZoom}
                            title="Reset Zoom"
                        >
                            <RotateCcwIcon />
                        </Button>
                    </div>

                    <svg className="border-2 w-full h-auto cursor-grab rounded-[4px]"
                        ref={svgRef}

                    >
                        <g ref={gRef}></g>
                    </svg>
                </div>
            </div>
        </>
    );
};

export default memo(Map);