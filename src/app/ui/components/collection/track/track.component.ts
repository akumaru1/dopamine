import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TrackModel } from '../../../../services/track/track-model';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { MetadataService } from '../../../../services/metadata/metadata.service';

@Component({
    selector: 'app-track',
    host: { style: 'display: block' },
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnChanges {
    private _track: TrackModel;
    public albumArtworkPath: string = '';

    public constructor(
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
        private metadataService: MetadataService,
    ) {}

    @Input() public canShowHeader: boolean = false;
    @Input() public isPlaylistView: boolean = false;

    @Input()
    public set track(value: TrackModel) {
        this._track = value;
    }

    public get track(): TrackModel {
        return this._track;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ((changes['track'] || changes['isPlaylistView'] || changes['canShowHeader']) && this._track) {
            // Load album artwork for playlist view (in track rows) or when showing album headers
            if (this.isPlaylistView || (this.canShowHeader && this._track.showHeader)) {
                try {
                    this.albumArtworkPath = this.metadataService.getAlbumArtworkPath(this._track.albumKey);
                } catch (error) {
                    // Silently handle errors to prevent app crashes
                    this.albumArtworkPath = '';
                }
            } else {
                this.albumArtworkPath = '';
            }
        }
    }
}
