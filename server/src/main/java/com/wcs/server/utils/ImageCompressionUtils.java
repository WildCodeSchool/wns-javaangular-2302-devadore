package com.wcs.server.utils;

import java.util.Arrays;
import java.util.zip.Deflater;
import java.util.zip.Inflater;
import java.util.zip.DataFormatException;
import java.io.IOException;

public class ImageCompressionUtils {

    public static byte[] compress(byte[] data) throws IOException {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();

        byte[] output = new byte[data.length];
        int compressDataLength = deflater.deflate(output);

        deflater.end();
        return Arrays.copyOf(output, compressDataLength);
    }

    public static byte[] decompress(byte[] data) throws DataFormatException, IOException {
        Inflater inflater = new Inflater();
        inflater.setInput(data);

        byte[] output = new byte[data.length * 2];
        int resultLength = inflater.inflate(output);

        inflater.end();
        return Arrays.copyOf(output, resultLength);
    }
}
