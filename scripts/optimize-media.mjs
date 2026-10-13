// Optimiza los assets del clon legacy (web/legacy/uploads) hacia static/media
// - PNG/JPG pesados -> WebP redimensionado (hallazgo §8.1 del análisis UX)
// - Nombres semánticos en español en lugar de hashes / "Captura_de_tela"
// Uso: pnpm media
import sharp from 'sharp';
import { copyFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(root, '../../legacy/uploads');
const LEGACY = path.resolve(root, '../../legacy');
const OUT = path.resolve(root, '../static/media');

/** [origen, destino, anchoMáximo] */
const images = [
	// Home
	['large_Group_11565_1_28bb365d91.png', 'home/hero-x-series.webp', 1600],
	['large_image_22_dc9dc45dd8.png', 'home/feature-battery.webp', 900],
	['02_image_sd_x_series_feature_performance_2000x2000_es_mx_720_f79ca44dcf.png', 'home/feature-performance.webp', 900],
	['03_image_sd_x_series_feature_ai_2000x2000_es_mx_720_49002aaced.png', 'home/feature-ai.webp', 900],
	['large_01_es_bd59ed15d8.jpg', 'home/video-poster.webp', 1600],
	['image_720_3a1223c2f9.png', 'home/banner-compute.webp', 1200],

	// Laptops
	['large_Video_SD_Compute_Troop_30_Pro_Res_16x9_English_OLV_COVER_5cc89a3136.jpg', 'laptops/video-poster.webp', 1600],
	['large_image_59_be4af462a2.png', 'laptops/zenbook-a16-kv.webp', 1400],
	['mock_compute_video_card_2026_54cf1fd786.png', 'laptops/highlight-battery.webp', 800],
	['mock_compute_video_card_2026_1_d615bb7163.png', 'laptops/highlight-speed.webp', 800],
	['mock_compute_video_card_2026_2_ddde4b6f1f.png', 'laptops/highlight-ai.webp', 800],
	['large_copilot_pc_latam_2026_b_eea537d8b4_b527866b29.png', 'laptops/copilot-pc.webp', 1400],
	['large_71h7d_Z_Skss_L_1_1_51e49c7070.png', 'laptops/zenbook-a14.webp', 900],
	['large_Asus_Zenbook_A16_1_48c125a81d.webp', 'laptops/zenbook-a16.webp', 900],
	['large_VIVOBOOK_S15_5fc09f41c9.png', 'laptops/vivobook-s15.webp', 900],
	['large_Yoga_Slim_7x_1_14e14874bc.png', 'laptops/yoga-slim-7x.webp', 900],
	['large_VIVOBOOK_16_2_1_51db7c6540.png', 'laptops/vivobook-16.webp', 900],
	['large_6303c230081818e717cc13a8be32d1795d893aaf_7e4ccd8911.png', 'laptops/ideapad-slim-5x.webp', 900],
	['large_VIVOBOOK_14_2_4b7741338c.png', 'laptops/vivobook-14.webp', 900],
	['image_1_360_05781f8e00.png', 'laptops/vivobook-s14.webp', 900],
	['large_HP_Omni_Book_5_a3222066c0.png', 'laptops/omnibook-5.webp', 900],

	// Procesadores
	['Badges_9_b95bccd49e.png', 'chips/x-elite.webp', 400],
	['Badges_8_d1827e3188.png', 'chips/x-plus-10.webp', 400],
	['Badges_10_f2d886b8c9.png', 'chips/x-plus-8.webp', 400],
	['Badges_7_697108b136.png', 'chips/x.webp', 400],
	['Badge_SD_X2_Elite_18_core_RGB_1_2_106f6bba3d.png', 'chips/x2-elite.webp', 400],

	// Smartphones
	['large_hero_paixao_94bab9cc52.jpg', 'phones/hero.webp', 1800],
	['large_banner_creatividad_5fb55465e8.jpg', 'phones/banner-creatividad.webp', 1600],
	['large_Thumb_Snapdragon_8_Elite_e8d81ff4a9.jpg', 'phones/video-poster.webp', 1600],
	['samsung_galaxy_z_fold_075b6391b3.jpg', 'phones/galaxy-z-fold6.webp', 800],
	['realme_gt_6_720_278b90e800.png', 'phones/realme-gt-6.webp', 800],
	['motorola_razr_50_ultra_307b9bcebe.jpg', 'phones/razr-50-ultra.webp', 800],
	['honor_magic_6_pro_720_e30cb81acf.png', 'phones/magic-6-pro.webp', 800],
	['48b3c56e1869cad408b6d5a1fc704098_1_9df4d40756.png', 'phones/xiaomi-15-ultra.webp', 800],
	['large_image_1_2_a812291cf3.png', 'phones/galaxy-z-fold8-ultra.webp', 900],
	['large_image_1_3_e53391e9bf.png', 'phones/galaxy-z-fold8.webp', 900],
	['item_01_87741e4a3d.png', 'phones/exp-battery.webp', 900],
	['item_02_236f3da573.png', 'phones/exp-audio.webp', 900],
	['item_03_4bad4dc51f.png', 'phones/exp-connect.webp', 900],
	['item_04_1174ff71bc.png', 'phones/exp-gaming.webp', 900],
	['badge_secure_17186fe73a.png', 'phones/badge-secure.webp', 300],
	['badge_smart_64561b7cdb.png', 'phones/badge-smart.webp', 300],
	['badge_sight_264c3113c5.png', 'phones/badge-sight.webp', 300],
	['badge_sound_e870c324a5.png', 'phones/badge-sound.webp', 300],
	['badge_connect_e06c7d0fb7.png', 'phones/badge-connect.webp', 300],
	['badge_elite_gaming_ae96038cf0.png', 'phones/badge-gaming.webp', 300],

	// Reviews
	['large_THUMB_BENJA_Lenovo_yoga_slim_7x_267d0aa93f.jpg', 'reviews/yoga-slim-7x.webp', 900],
	['large_Thumb_Benja_Asus_Vivobook_S15_b4bcb473b0.png', 'reviews/vivobook-s15.webp', 900],
	['large_Thumb_Benja_Asus_Zenbook_A14_0974933185.png', 'reviews/zenbook-a14.webp', 900],
	['large_Cover_S26_Ultra_Benja_2_8d00b6870b.png', 'reviews/galaxy-s26-ultra.webp', 900],
	['large_Thumb_Benja_Honor_400_Pro_479394c308.png', 'reviews/honor-400-pro.webp', 900],
	['Captura_de_tela_2026_03_27_153404_2536eae1d5.png', 'reviews/motorola-signature.webp', 900],
	['large_Cover_Benja_Xiaomi_15_Ultra_04f55f7d91.png', 'reviews/xiaomi-15-ultra.webp', 900],
	['large_Thumb_Benja_Moto_AI_Razr_60_Ultra_856f75f219.png', 'reviews/razr-60-ultra.webp', 900],
	['Z_Flip_6_Z_Fold_6_57be93a1a8.jpg', 'reviews/z-flip-fold6.webp', 900],

	// Insiders
	['large_Global_Aniversa_uerio_SNAPDRAGON_INSIDERS_2025_Horizontal_ESP_16e695375c.png', 'insiders/aniversario-poster.webp', 1600],
	['large_banner_insiders_0ac8163c3f.jpg', 'insiders/banner.webp', 1600],

	// Promociones
	['large_Captura_de_tela_2026_07_20_151150_22fb667002.png', 'promo/snappremios-s26.webp', 1200],
	['large_Captura_de_tela_2026_07_28_164004_b4199f2cac.png', 'promo/snapx-omnibook.webp', 1200],
	['large_Captura_de_tela_2026_07_28_164339_e7ca286df8.png', 'promo/creators.webp', 1200],
	['large_KV_Snapdragon_Design_16c2208d21.png', 'promo/design.webp', 1200]
];

// Galería "Hecho en Latam": [foto, avatar, slug]
const creators = [
	['large_17113_F84_3_C62_4815_9_A6_D_95554_DD_6_AE_9_D_9900a0d6dd.jpg', 'large_Benjamin_73935105d2.jpg', 'luis-alberti'],
	['large_1788354495971_d77d7910f4.jpeg', 'large_perfil_5_c92becbe0f.jpg', 'ricardo-general'],
	['large_foto_6_0bfce462f0.JPG', 'large_perfil_6_2592313461.jpg', 'javier-barba'],
	['large_foto_13_cf82f69689.jpg', 'large_foto_5_6a99765229.jpg', 'julian-paez'],
	['large_foto_16_85e331d3b9.jpg', 'large_perfil_7_b6797747e5.jpg', 'benjamin-laluz'],
	['ft_menor_3_3136a06923.png', 'large_foto_perfil_1_a59947467b.jpg', 'luis-balada'],
	['large_foto1_3_e3aeedf87f.jpg', 'large_profile_4_0b1ea87246.jpg', 'german-rudaz'],
	['large_photo_3_6bc4115c54.jpg', 'large_profile_3_a53f7d9bb9.jpg', 'hache-film'],
	['Captura_de_tela_2026_08_10_160231_57b1ecb0d0.png', 'large_foto_18_13d28d1a42.jpg', 'dinave-art'],
	['Captura_de_tela_2026_08_21_104444_ee0245666f.png', 'Whats_App_Image_2026_08_21_at_10_46_23_36ca422767.jpeg', 'patricio-gonzalez'],
	['large_foto_david_7e58011c4a.jpg', 'large_david_fa1108b47f.jpg', 'david-anthony'],
	['large_foto_julio_901dd5264b.jpg', 'large_julio_6274ea9093.jpg', 'julio-aguilar'],
	['large_foto_Julian_9543349fe2.jpg', 'large_Julian_1_2c1c87bdae.jpg', 'julian-castellanos'],
	['large_foto_daniel2_4cf3908c15.jpg', 'large_daniel_73cfd37bad.jpg', 'daniel-munoz'],
	['large_foto_enfoquetech1_cac17d6cff.jpg', 'large_foto_enfoquetech13_d8c34e0729.jpg', 'enfoque-tech'],
	['large_foto_santiago_81673facd7.jpg', 'Santiago_7909f72c34.jpg', 'santiago-acevedo'],
	['large_foto_duraznouy2_42653ba7be.jpg', 'large_Whats_App_Image_2026_08_21_at_11_02_02_a8ff78a36f.jpeg', 'duraznouy'],
	['large_foto_diego_df17c40533.jpg', 'Whats_App_Image_2026_08_21_at_11_02_02dd_b1d7826be7.jpeg', 'diego-villamizar'],
	['large_photo_4_076a99d95d.jpg', 'large_profile_4_ad398065d9.jpg', 'francisco-quiroz'],
	['large_photo_5_cf655809bc.jpg', 'large_profile_5_381ab2e054.jpg', 'eljuancri'],
	['large_photo_6_26840befe3.jpg', 'large_profile_6_673e4528dc.jpg', 'luis-lobi-ponce']
];
for (const [photo, avatar, slug] of creators) {
	images.push([photo, `insiders/${slug}.webp`, 900]);
	images.push([avatar, `insiders/${slug}-avatar.webp`, 160]);
}

// Videos: se copian tal cual (sin ffmpeg disponible). En la UI se cargan
// solo bajo demanda (click-to-play, preload="none") -> hallazgo §8.1.
const videos = [
	['01_es_03905d5c91.mp4', 'video/home-x-series.mp4'],
	['Zenbook_A16_UX_3607_OA_KV_video_16_X9_1_e2466ac1f6.mp4', 'video/zenbook-a16.mp4'],
	['Video_SD_Compute_Troop_30_Pro_Res_16x9_English_OLV_1_987de513ea.mp4', 'video/compute-troop.mp4'],
	['S8_Elite_1080_social_H_de311d9e5d.mp4', 'video/snapdragon-8-elite.mp4'],
	['Global_Aniversa_uerio_SNAPDRAGON_INSIDERS_2025_Horizontal_ESP_b3e3cd6769.mp4', 'video/insiders-aniversario.mp4']
];

let before = 0;
let after = 0;
let skipped = 0;

for (const [src, dest, width] of images) {
	const input = path.join(SRC, src);
	const output = path.join(OUT, dest);
	if (!existsSync(input)) {
		console.warn(`  ⚠ falta origen: ${src}`);
		skipped++;
		continue;
	}
	await mkdir(path.dirname(output), { recursive: true });
	await sharp(input)
		.resize({ width, withoutEnlargement: true })
		.webp({ quality: 78, effort: 5 })
		.toFile(output);
	before += (await stat(input)).size;
	after += (await stat(output)).size;
}

for (const [src, dest] of videos) {
	const input = path.join(SRC, src);
	if (!existsSync(input)) continue;
	const output = path.join(OUT, dest);
	await mkdir(path.dirname(output), { recursive: true });
	await copyFile(input, output);
}

// Marca
await mkdir(path.join(OUT, 'brand'), { recursive: true });
for (const f of ['img/logo-snapdragon-red.svg', 'img/logo-snap-promo.svg', 'icon.svg']) {
	const input = path.join(LEGACY, f);
	if (existsSync(input)) await copyFile(input, path.join(OUT, 'brand', path.basename(f)));
}
const formBg = path.join(LEGACY, 'img/torne-se-um-snapdragon-insider.jpg');
if (existsSync(formBg)) {
	await sharp(formBg).resize({ width: 1800 }).webp({ quality: 72 }).toFile(path.join(OUT, 'insiders/newsletter-bg.webp'));
}

const mb = (b) => (b / 1024 / 1024).toFixed(2);
console.log(`\n✔ Imágenes: ${images.length - skipped} optimizadas (${skipped} faltantes)`);
console.log(`  Antes: ${mb(before)} MB  →  Después: ${mb(after)} MB  (-${(100 - (after / before) * 100).toFixed(1)}%)`);
